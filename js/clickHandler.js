import showScreen from "./screenRenderer";

const onNextButtonClick = (evt, nextScreen) => {
  evt.preventDefault();
  showScreen(nextScreen);
};

export default onNextButtonClick;
