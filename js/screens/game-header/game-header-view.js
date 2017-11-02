import AbstractView from "../../utils/abstract-view";
import headerBack from "./header-back";

export default class HeaderView extends AbstractView {
  constructor(stateData) {
    super();
    this.stateData = stateData;
  }

  get template() {
    return `
      <header class="header">
        ${headerBack}
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