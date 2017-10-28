import {stateData} from "../play-data";

export const countScore = () => {
  const ANSWER_SCORE = {
    correct: 100,
    fast: 50,
    slow: 50
  };
  const scoreForLives = 50;

  const rightAnswers = stateData.answers.filter((elem) => {
    return elem !== `wrong`;
  });
  const fastAnswers = rightAnswers.filter((elem) => {
    return elem === `fast`;
  });
  const slowAnswers = rightAnswers.filter((elem) => {
    return elem === `slow`;
  });

  return {
    forRightAnswers: rightAnswers.length * ANSWER_SCORE.correct,
    forFastAnswers: fastAnswers.length * ANSWER_SCORE.fast,
    forSlowAnswers: slowAnswers.length * ANSWER_SCORE.slow,
    forLives: stateData.lives * scoreForLives,
    quantity: {
      forFast: fastAnswers.length,
      forSlow: slowAnswers.length
    }
  };
};

export const statsData = {
  header: `<header class="header">
    <div class="header__back">
      <button class="back">
        <img src="img/arrow_left.svg" width="45" height="45" alt="Back">
        <img src="img/logo_small.svg" width="101" height="44">
      </button>
    </div>
  </header>`
};
