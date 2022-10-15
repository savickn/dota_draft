
import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

class QuizHomePage extends React.Component {

  render() {
    return (
      <div className="flex-column">
        <Link to='/quiz/counters'>Hero Counter Quiz</Link>
        <Link to='/quiz/draftCounter'>Draft Counter Quiz</Link>
        <Link to='/quiz/draftSynergy'>Last Pick Quiz</Link>
      </div>
    );
  }
}

export default QuizHomePage;