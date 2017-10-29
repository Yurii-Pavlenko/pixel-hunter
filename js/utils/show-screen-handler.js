import renderScreen from "./screen-renderer";

const onNextButtonClick = (evt, nextScreen) => {
  evt.preventDefault();
  renderScreen(nextScreen);
};

export default onNextButtonClick;
