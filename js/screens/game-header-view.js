import AbstractView from "../utils/abstract-view";

export default class HeaderView extends AbstractView {
  constructor(stateData) {
    super();
    this.stateData = stateData;
  }

  get template() {
    return `
      <header class="header">
        <div class="header__back">
      <button class="back">
        <img src="img/arrow_left.svg" width="45" height="45" alt="Back">
        <img src="img/logo_small.svg" width="101" height="44">
      </button>
    </div>
        <h1 class="game__timer">${this.stateData.time}</h1>
        <div class="game__lives">
        ${new Array(3 - this.stateData.lives)
      .fill(`<img src="img/heart__empty.svg" class="game__heart" alt="Life" width="32" height="32">`)
      .join(``)}
      ${new Array(this.stateData.lives)
      .fill(`<img src="img/heart__full.svg" class="game__heart" alt="Life" width="32" height="32">`)
      .join(``)}
        </div>
      </header>`.trim();
  }
}
