import getElementFromTemplate from "../../utils/get-element-from-html";
import onNextButtonClick from "../../utils/show-screen-handler";
import gameHeader from "../game-header";
import gameStats from "../game-stats";
import {stateData, isQuestions, isLives} from "../play-data";
import {game1Data, renderAnswers1} from "./game1-data";
import greeting from "../greeting/greeting";
import game2 from "../game2/game2";
import stats from "../stats/stats";
import renderScreen from "../../utils/screen-renderer";

export default () => {
  const game1 = getElementFromTemplate(`
  ${gameHeader(stateData)}
  <div class="game">
    <p class="game__task">Угадайте для каждого изображения фото или рисунок?</p>
    <form class="game__content">
      <div class="game__option">
        <img src=${game1Data.pictures[stateData.game].imgSrc} alt="Option 1" width="468" height="458">
        <label class="game__answer game__answer--photo">
          <input name="question1" type="radio" value="photo">
          <span>Фото</span>
        </label>
        <label class="game__answer game__answer--paint">
          <input name="question1" type="radio" value="paint">
          <span>Рисунок</span>
        </label>
      </div>
      <div class="game__option">
        <img src=${game1Data.pictures[stateData.game + 1].imgSrc} alt="Option 2" width="468" height="458">
        <label class="game__answer  game__answer--photo">
          <input name="question2" type="radio" value="photo">
          <span>Фото</span>
        </label>
        <label class="game__answer  game__answer--paint">
          <input name="question2" type="radio" value="paint">
          <span>Рисунок</span>
        </label>
      </div>
    </form>
    ${gameStats(stateData)}
  </div>
`);
  const headerBack = game1.querySelector(`.header__back`);
  const gameContent = game1.querySelector(`.game__content`);
  const question1 = game1.querySelectorAll(`input[name=question1]`);
  const question2 = game1.querySelectorAll(`input[name=question2]`);
  const enoughQuantity = 2;

  const needQuantity = () => {
    return gameContent.querySelectorAll(`input[type="radio"]:checked`).length;
  };

  gameContent.addEventListener(`change`, (evt) => {
    if (isQuestions() && needQuantity() === enoughQuantity ||
      isLives() && needQuantity() === enoughQuantity) {
      onNextButtonClick(evt, stats());
    } else if (needQuantity() === enoughQuantity) {
      renderAnswers1(question1, question2);
      stateData.game += 2;
      onNextButtonClick(evt, game2());
    }
  });

  /*  headerBack.addEventListener(`click`, (evt) => {
    onNextButtonClick(evt, greeting());
  });*/

  headerBack.onclick = () => renderScreen(greeting());

  return game1;
};
