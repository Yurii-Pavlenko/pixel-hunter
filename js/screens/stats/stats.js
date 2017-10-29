import getElementFromTemplate from "../../utils/get-element-from-html";
import {goBack, stateData} from "../play-data";
import {statsData, countScore} from "./stats-data";

export default() => {
  const renderTitle = () => {
    return stateData.victory ? `Победа!` : `Поражение`;
  };

  const renderResults = () => {
    let printResults;
    if (!stateData.victory) {
      printResults = `<tr>
        <td class="result__number">1.</td>
        <td colspan="2">
          <ul class="stats">
        ${[...stateData.answers].map((level) => `<li class="stats__result stats__result--${level}"></li>`)}
      </ul>
        </td>
        <td class="result__points">×&nbsp;100</td>
        <td class="result__total">fail</td>
      </tr>`;
    } else {
      printResults = `<tr>
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
      </tr>`;
    }
    return printResults;
  };

  const stats = getElementFromTemplate(`
  ${statsData.header}
  <div class="result">
    <h1>${renderTitle()}</h1>
    <table class="result__table">${renderResults()}</table>
`);
  const headerBack = stats.querySelector(`.header__back`);

  headerBack.onclick = () => {
    goBack(stateData);
  };

  return stats;
};
