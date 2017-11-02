import AbstractView from "../../utils/abstract-view";
import HeaderView from "../game-header-view";
import {renderAnswers3} from "./game3-data";
import {chooseAnswerType} from "../play-data";

export default class Game3View extends AbstractView {

  constructor(stateData, gameStats, img1, img2, img3) {
    super();
    this.stateData = stateData;
    this.header = new HeaderView(this.stateData);
    this.img1 = img1;
    this.img2 = img2;
    this.img3 = img3;
    this.gameStats = gameStats(this.stateData);
  }

  get template() {
    return `${this.header.template}
  <div class="game">
    <p class="game__task">Найдите рисунок среди изображений</p>
    <form class="game__content  game__content--triple">
      <div class="game__option">
        <img src=${this.img1.imgSrc} alt="Option 1" width="304" height="455">
      </div>
      <div class="game__option">
        <img src=${this.img2.imgSrc} alt="Option 1" width="304" height="455">
      </div>
      <div class="game__option">
        <img src=${this.img3.imgSrc} alt="Option 1" width="304" height="455">
      </div>
    </form>
    ${this.gameStats}
  </div>`;
  }

  bind() {
    const headerBack = this.element.querySelector(`.header__back`);
    const gameContent = Array.from(this.element.querySelectorAll(`.game__option`));
    const questions = [];
    const imgArray = [this.img1, this.img2, this.img3];

    gameContent.forEach((option) => {
      option.onclick = () => {
        option.classList.add(`game__option--selected`);
        const answers3 = gameContent.map((opt) => {
          return (opt.classList.contains(`game__option--selected`)) ? `paint` : `photo`;
        });
        for (let i = 0; i < answers3.length; i++) {
          questions.push(imgArray[i].imgType);
        }
        renderAnswers3(questions, answers3, chooseAnswerType());
      };
    });


    headerBack.addEventListener(`click`, this.onBackClick);
  }

  onButtonClick() {

  }

  onBackClick() {

  }
}
