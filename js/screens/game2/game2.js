import getElementFromTemplate from "../../utils/get-element-from-html";
import onNextButtonClick from "../../utils/show-screen-handler";
import gameHeader from "../game-header";
import gameStats from "../game-stats";
import {game2Date, renderAnswers2} from "./game2-data";
import {stateData, isLives, isQuestions} from "../play-data";
import greeting from "../greeting/greeting";
import game3 from "../game3/game3";
import renderScreen from "../../utils/screen-renderer";
import stats from "../stats/stats";

export default () => {
  const game2 = getElementFromTemplate(`
  ${gameHeader(stateData)}
  <div class="game">
    <p class="game__task">Угадай, фото или рисунок?</p>
    <form class="game__content  game__content--wide">
      <div class="game__option">
        <img src=${game2Date.pictures[stateData.game].imgSrc} alt="Option 1" width="705" height="455">
        <label class="game__answer  game__answer--photo">
          <input name="question1" type="radio" value="photo">
          <span>Фото</span>
        </label>
        <label class="game__answer  game__answer--wide  game__answer--paint">
          <input name="question1" type="radio" value="paint">
          <span>Рисунок</span>
        </label>
      </div>
    </form>
    ${gameStats(stateData)}
  </div>
`);
  const headerBack = game2.querySelector(`.header__back`);
  const gameContent = game2.querySelector(`.game__content`);
  const question1 = game2.querySelectorAll(`input[name=question1]`);


  /* const answers = () => {
    return gameContent.querySelectorAll(`input[type="radio"]:checked`).length;
  };*/

  gameContent.addEventListener(`change`, (evt) => {
    if (isLives() || isQuestions()) {
      onNextButtonClick(evt, stats());
    } else {
      renderAnswers2(question1);
      onNextButtonClick(evt, game3());
    }
  });

  headerBack.onclick = () => renderScreen(greeting());

  return game2;
};
