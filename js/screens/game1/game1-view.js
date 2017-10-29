import AbstractView from "../../utils/abstract-view";
import gameHeader from "../game-header";
import {stateData} from "../play-data";
import {getPictures} from "../../utils/get-pictures";
import pictures from "../../utils/pictures";
import gameStats from "../game-stats";

const IMG_NUMBER = 2;
const imgArray = getPictures(pictures, IMG_NUMBER);

export default class Game1View extends AbstractView {

  get template() {
    return String.raw`${gameHeader(stateData)}
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
  </div>`;
  }

  bind() {
    const headerBack = this.element.querySelector(`.header__back`);
    const gameContent = this.element.querySelector(`.game__content`);
    const question1 = this.element.querySelectorAll(`input[name=question1]`);
    const question2 = this.element.querySelectorAll(`input[name=question2]`);
    const ENOUGH_QUANTITY = 2;

    const needQuantity = () => {
      return gameContent.querySelectorAll(`input[type="radio"]:checked`).length;
    };

    gameContent.addEventListener(`change`, this.onButtonClick);


    headerBack.addEventListener(`click`, this.onBackClick);
    /*
      () => {
      if (needQuantity() === ENOUGH_QUANTITY) {
        renderAnswers1(question1, question2, imgArray, chooseAnswerType());
        checkNext(stateData, game1Data);
      }
    });

    headerBack.onclick = () => {
      goBack(stateData);
    };*/
  }

  onButtonClick() {

  }

  onBackClick() {

  }

}

