import getElementFromTemplate from "../utils/get-element-from-html";
import onNextButtonClick from "../utils/show-screen-handler";

export default (data) => {

  const intro = getElementFromTemplate(`
<div id="main" class="central__content">
  <div id="intro" class="intro">
  <h1 class="intro__asterisk">*</h1>
  <p class="intro__motto"><sup>*</sup>${data.intro.description}</p>
</div>
</div>
`);

  const asteriskButton = intro.querySelector(`.intro__asterisk`);

  asteriskButton.addEventListener(`click`, (evt) => {
    onNextButtonClick(evt, data.intro.jumpTo.next(data));
  });

  return intro;
};
