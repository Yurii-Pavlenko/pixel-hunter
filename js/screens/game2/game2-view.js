import AbstractView from "../../utils/abstract-view";
import HeaderView from "../game-header-view";
import {renderAnswers2} from "./game2-data";
import {chooseAnswerType} from "../play-data";

export default class Game2View extends AbstractView {

  constructor(stateData, gameStats, img) {
    super();
    this.stateData = stateData;
    this.header = new HeaderView(this.stateData);
    this.img = img;
    this.gameStats = gameStats(this.stateData);
  }

  get template() {
    return `${this.header.template}
  <div class="game">
    <p class="game__task">Угадай, фото или рисунок?</p>
    <form class="game__content  game__content--wide">
      <div class="game__option">
        <img src=${this.img.imgSrc} alt="Option 1" width="705" height="455">
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
    ${this.gameStats}
  </div>`;
  }

  bind() {
    const headerBack = this.element.querySelector(`.header__back`);
    const gameContent = this.element.querySelector(`.game__content`);
    const question1 = this.element.querySelectorAll(`input[name=question1]`);

    gameContent.addEventListener(`change`, () =>{
      renderAnswers2(question1, this.img, chooseAnswerType());
      this.onButtonClick();
    });

    headerBack.addEventListener(`click`, this.onBackClick);
  }

  onButtonClick() {

  }

  onBackClick() {

  }
}
