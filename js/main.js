import showScreen from "./screenRenderer";
import intro from "./intro";

showScreen(intro);

/* // Switch screens handler
const onButtonPush = (evt) => {
  if (evt.altKey && evt.keyCode === LEFT_ARROW && activeTemplateNumber > 0) {
    showScreen(--activeTemplateNumber);
  } else {
    if (evt.altKey && evt.keyCode === RIGHT_ARROW && activeTemplateNumber < screenTemplates.length - 1) {
      showScreen(++activeTemplateNumber);
    }
  }
};

document.addEventListener(`keydown`, onButtonPush);*/

