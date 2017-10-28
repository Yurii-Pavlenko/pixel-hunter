// import greeting from "../greeting/greeting";

import {stateData} from "../play-data";

const countScore = () => {
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
  </header>`,

  ifLoose: `<tr>
        <td class="result__number">1.</td>
        <td colspan="2">
          <ul class="stats">
        ${[...stateData.answers].map((level) => `<li class="stats__result stats__result--${level}"></li>`)}
      </ul>
        </td>
        <td class="result__points">×&nbsp;100</td>
        <td class="result__total">fail</td>
      </tr>`,
  ifWin: `<tr>
        <td class="result__number">1.</td>
        <td colspan="2">
          <ul class="stats">
        ${[...stateData.answers].map((level) => `<li class="stats__result stats__result--${level}"></li>`)}
      </ul>
        </td>
        <td class="result__points">×&nbsp;100</td>
        <td class="result__total">${countScore().forRightAnswers}</td>
      </tr>
      <tr>
        <td></td>
        <td class="result__extra">Бонус за скорость:</td>
        <td class="result__extra">${countScore().quantity.forFast}&nbsp;<span class="stats__result stats__result--fast"></span></td>
        <td class="result__points">×&nbsp;50</td>
        <td class="result__total">${countScore().forFastAnswers}</td>
      </tr>
      <tr>
        <td></td>
        <td class="result__extra">Бонус за жизни:</td>
        <td class="result__extra">${stateData.lives}&nbsp;<span class="stats__result stats__result--alive"></span></td>
        <td class="result__points">×&nbsp;50</td>
        <td class="result__total">${countScore().forLives}</td>
      </tr>
      <tr>
        <td></td>
        <td class="result__extra">Штраф за медлительность:</td>
        <td class="result__extra">${countScore().quantity.forSlow}&nbsp;<span class="stats__result stats__result--slow"></span></td>
        <td class="result__points">×&nbsp;50</td>
        <td class="result__total">-${countScore().forSlowAnswers}</td>
      </tr>
      <tr>
        <td colspan="5" class="result__total  result__total--final">${countScore().forRightAnswers + countScore().forFastAnswers - countScore().forSlowAnswers + countScore().forLives}</td>
      </tr>`
};
