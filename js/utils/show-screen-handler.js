import showScreen from "./screen-renderer";

const onNextButtonClick = (evt, nextScreen) => {
  evt.preventDefault();
  showScreen(nextScreen);
};

export default onNextButtonClick;
