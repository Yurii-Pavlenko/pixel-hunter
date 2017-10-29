import GreetingView from "./greeting-view";
import renderScreen from "../../utils/screen-renderer";
import rules from "../rules/rules";

const greeting = new GreetingView();

greeting.onButtonClick = () => {
  renderScreen(rules);
};

export default greeting;
