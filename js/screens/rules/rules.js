import RulesView from "./rules-view";
import {goBack} from "../play-data";
import renderScreen from "../../utils/screen-renderer";
import game1 from "../game1/game1";

const rules = new RulesView();

rules.onButtonClick = (evt) => {
  evt.preventDefault();
  renderScreen(game1());
};

rules.onBackClick = () => {
  goBack();
};

export default rules;


