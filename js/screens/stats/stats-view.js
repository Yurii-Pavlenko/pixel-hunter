import AbstractView from "../../utils/abstract-view";
import HeaderView from "../game-header/game-header-view";

export default class StatsView extends AbstractView {
  constructor() {
    super();
    this.header = new HeaderView();
  }
}

