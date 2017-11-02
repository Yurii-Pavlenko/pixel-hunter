import AbstractView from "../../utils/abstract-view";
import HeaderView from "../game-header/game-header-view";
import {renderAnswers1} from "./game1-data";
import {chooseAnswerType} from "../play-data";

export default class Game1View extends AbstractView {

  constructor(stateData, gameStats, img1, img2) {
    super();
    this.stateData = stateData;
    this.header = new HeaderView(this.stateData);
    this.img1 = img1;
    this.img2 = img2;
    this.gameStats = gameStats(this.stateData);
  }

  get template() {
    return `${this.header.template}
  <div class="game">
    <p class="game__task">Угадайте для каждого изображения фото или рисунок?</p>
    <form class="game__content">
      <div class="game__option">
        <img src=${this.img1.imgSrc} alt="Option 1" width="468" height="458">
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
        <img src=${this.img2.imgSrc} alt="Option 2" width="468" height="458">
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
    ${this.gameStats}
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

    gameContent.addEventListener(`change`, () => {
      if (needQuantity() === ENOUGH_QUANTITY) {
        renderAnswers1(question1, question2, this.img1, this.img2, chooseAnswerType());
        this.onButtonClick();
      }
    });

    headerBack.addEventListener(`click`, this.onBackClick);
  }

  onButtonClick() {

  }

  onBackClick() {

  }
}

