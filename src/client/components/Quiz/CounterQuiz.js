
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { debounce } from 'lodash';

// components
import HeroIcon from '../Hero/components/HeroIcon';

// redux
import { searchHeroesRequest, } from '../Hero/HeroActions';
import { getHeroes, } from '../Hero/HeroReducer';

import styles from './quiz.scss';

const questions = [
  'Choose the top hero counter for the hero shown below.',
  'Choose the top item counter for the hero shown below.', 
  'Choose the best hero for complete the current draft.',
  'Choose the best hero to counter the following draft.'
];



// show hero and ask for counters (either item or hero)
class CounterQuiz extends React.Component {
  
  constructor(props) {
    super(props);
    this.state = {
      score: 0,
      question: null,
      result: null,

      qHero: null, // hero question is based on
      aHero: null, // chosen hero
      
      choices: [], // heroes from which to choose answer
      correct: [], // correct answers

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


  

  // evaluates an answer
  // red is selected but incorrect
  // green is selected and correct
  // blue is not selected and correct
  selectAnswer = (hero) => {
    console.log(hero);

    let { correct, score, } = this.state;

    let correctNames = correct.map(c => c.localized_name);

    if(correctNames.includes(hero.localized_name)) {
      score++;
    }

    this.setState({ aHero: hero, score, questionInProgress: false });
  }





  getBestCounter = (hero, options) => {
    console.log(hero);
    console.log(options);
    let optionNames = options.map(h => h.localized_name);
    let counters = hero.matchups.filter(m => optionNames.includes(m.enemy));
    console.log(counters);
    let sorted = counters.sort((a,b) => b.disadvantage - a.disadvantage);
    console.log(sorted);
    let bestCounter = sorted[0].enemy;

    return options.filter(o => o.localized_name === bestCounter);
  }

  getBestSynergy = () => {

  }


  // populates a question
  getQuestion = () => {
    let n = 9;

    // choose question hero
    let pool = this.props.heroes;
    let r = Math.floor(Math.random() * Math.floor(pool.length));
    let qHero = pool[r];
    pool.splice(r, 1);

    // pick question
    let question = questions[0];

    // pick choices
    const shuffled = pool.sort(() => 0.5 - Math.random());
    let choices = shuffled.slice(0, n);

    // pick correct
    let correct = this.getBestCounter(qHero, choices);
    console.log('correct -- ', correct);

    this.setState({ question, qHero, choices, correct, questionInProgress: true});
  }


  /* Game Flow */

  // start game
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



  // used to style answer (right, wrong, etc)
  getHeroStyle = (hero) => {
    let style = '';
    let { aHero, correct } = this.state;
    if(!hero || !aHero) return '';

    // if selected
    if(hero.localized_name === aHero.localized_name) {
      // if correct --> make blue
      if(correct.filter(c => c.localized_name === aHero.localized_name).length > 0) {
        style = styles.correct_selected;
      } else { // if incorrect --> make red
        style = styles.incorrect_selected;
      }
    } else { // if unselected
      // if correct --> make green 
      if(correct.filter(c => c.localized_name === hero.localized_name).length > 0) {
        style = styles.correct;
      }
    }
    return style;
  }

  
  render() {
    const { heroes, } = this.props;
    const { score, question, result, choices, correct, qHero, aHero, 
      questionInProgress, isActive, } = this.state;

    console.log(this.state);

    return heroes.length > 0 ? ( 
      <div className="flex-column-center">
        <div>
          <button className='minimal-btn' onClick={() => this.start()}>Start</button>
        </div>
        <div>{score}</div>
        <div className="flex-row">
          <div className="question">
            <div className="text">
              {question}
            </div>
            <div className="questionHero">
              {qHero && <HeroIcon hero={qHero} clickHandler={null} />}
            </div>
          </div>
          <div className="next">
            {isActive && !questionInProgress && 
              <button onClick={() => this.next()}>Next</button>
            }
          </div>
        </div>

        <div className="choices wrappable-flex-row">
          {choices.map((h) => {
            let heroStyle = this.getHeroStyle(h);
            if(h.localized_name !== qHero.localized_name) {
              return (
                <div className={`${styles.flex_33}`}>
                  <div class={`${styles.choice} ${heroStyle}`}>
                    <HeroIcon hero={h} i_width="256" i_height="144" 
                      clickHandler={this.selectAnswer} />
                  </div>
                </div>
              ); 
            }
          })}
        </div>
      </div>
    ) : <div></div>;
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


/*

          <div className="answer">
            <div className="result">  
              {result}
            </div>
            <div className="answerHero">
              {aHero && <HeroIcon hero={aHero} clickHandler={null} />}
            </div>
          </div>
*/
