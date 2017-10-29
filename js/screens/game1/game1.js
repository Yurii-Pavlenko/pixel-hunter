import getElementFromTemplate from "../../utils/get-element-from-html";
import gameHeader from "../game-header";
import gameStats from "../game-stats";
import {stateData, goBack, chooseAnswerType} from "../play-data";
import {game1Data, renderAnswers1} from "./game1-data";
import {getPictures} from "../../utils/get-pictures";
import pictures from "../../utils/pictures";
import checkNext from "../../utils/check-next";

const IMG_NUMBER = 2;

export default () => {
  const imgArray = getPictures(pictures, IMG_NUMBER);
  const game1 = getElementFromTemplate(`
  ${gameHeader(stateData)}
  <div class="game">
    <p class="game__task">Угадайте для каждого изображения фото или рисунок?</p>
    <form class="game__content">
      <div class="game__option">
        <img src=${imgArray[0].imgSrc} alt="Option 1" width="468" height="458">
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
        <img src=${imgArray[1].imgSrc} alt="Option 2" width="468" height="458">
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
  const ENOUGH_QUANTITY = 2;

  const needQuantity = () => {
    return gameContent.querySelectorAll(`input[type="radio"]:checked`).length;
  };

  gameContent.addEventListener(`change`, () => {
    if (needQuantity() === ENOUGH_QUANTITY) {
      renderAnswers1(question1, question2, imgArray, chooseAnswerType());
      checkNext(stateData, game1Data);
    }
  });

  headerBack.onclick = () => {
    goBack(stateData);
  };

  return game1;
};
