import onNextButtonClick from "../utils/show-screen-handler";
import greeting from "./greeting";

const returnToGreeting = (headerBack) => {
  headerBack.addEventListener(`click`, (evt) => {
    onNextButtonClick(evt, greeting);
  });
};

export default returnToGreeting;
