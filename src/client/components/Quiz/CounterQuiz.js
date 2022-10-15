
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { debounce } from 'lodash';

// components
import HeroIcon from '../Hero/components/HeroIcon';

// redux
import { searchHeroesRequest, } from '../Hero/HeroActions';
import { getHeroes, } from '../Hero/HeroReducer';

const questions = [
  'What hero counters the hero shown below?',
  'What item counters the hero shown below?', 

];

// show hero and ask for counters (either item or hero)
class CounterQuiz extends React.Component {
  
  constructor(props) {
    super(props);
    this.state = {
      score: 0,
      question: null,
      result: null,
      qHero: null,
      aHero: null, 
      isActive: false, // game is either started or stopped
      questionInProgress: false, // question is either answered or not 
    };
  }

  componentDidMount() {
    this.searchHeroes(); // get products from DB
  }

  // send AJAX request to populate heroes/etc
  searchHeroes = debounce(() => {
    this.props.dispatch(searchHeroesRequest(this.state.search, this.state.pagination));
  })


  start = () => {
    this.setState({ score: 0, isActive: true }, () => {
      this.getQuestion();
    });
  }

  // moves to next question
  next = () => {
    this.setState({ aHero: null, }, () => {
      this.getQuestion();
    });
  }

  // evaluates an answer
  selectAnswer = (hero) => {



    this.setState({ aHero: hero, questionInProgress: false });
  }

  // populates a question
  getQuestion = () => {
    const heroes = this.props.heroes;
    let n = Math.floor(Math.random() * Math.floor(heroes.length));

    let question = questions[0];
    let qHero = heroes[n];

    this.setState({question, qHero, questionInProgress: true});
  }
  
  render() {
    const { heroes, } = this.props;
    const { score, question, result, qHero, aHero, 
      questionInProgress, isActive, } = this.state;

    return (
      <div className="flex-column">
        <div className="flex-row">
          <div className="question">
            <div className="text">
              {question}
            </div>
            <div className="questionHero">
              {qHero && <HeroIcon hero={qHero} clickHandler={null} />}
            </div>
          </div>
          <div className="answer">
            <div className="result">  
              {result}
            </div>
            <div className="answerHero">
              {aHero && <HeroIcon hero={aHero} clickHandler={null} />}
            </div>
          </div>
          <div className="next">
            {isActive && !questionInProgress && 
              <button onClick={() => this.next()}>Next</button>
            }
          </div>
        </div>

        <div className="choices wrappable-flex-row">
          {questionInProgress && heroes.map((h) => {
            if(h.localized_name !== qHero.localized_name) {
              return (
                <div>
                  <HeroIcon hero={h} clickHandler={this.selectAnswer} />
                </div>
              ); 
            }
          })}
        </div>
        <div>
          <button onClick={() => this.start()}>Start</button>
        </div>
        <div>{score}</div>
      </div>
    );
  }
}

CounterQuiz.propTypes = {

};

const mapStateToProps = (state) => {
  return {
    data: "", // represents 
    heroes: getHeroes(state), 
    items: [], 
  };
};

export default connect(mapStateToProps)(CounterQuiz);