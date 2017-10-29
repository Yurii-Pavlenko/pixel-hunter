import IntroView from "./intro-view";
import renderScreen from "../../utils/screen-renderer";
import greeting from "../greeting/greeting";

const intro = new IntroView();

intro.onAsteriskClick = () => {
  renderScreen(greeting);
};

export default intro;
