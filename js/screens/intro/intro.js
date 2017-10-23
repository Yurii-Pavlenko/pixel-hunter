import getElementFromTemplate from "../../utils/get-element-from-html";
import onNextButtonClick from "../../utils/show-screen-handler";
import greeting from "../greeting/greeting";

export default () => {

  const intro = getElementFromTemplate(`
<div id="main" class="central__content">
  <div id="intro" class="intro">
  <h1 class="intro__asterisk">*</h1>
  <p class="intro__motto"><sup>*</sup> Это не фото. Это рисунок маслом нидерландского художника-фотореалиста Tjalf Sparnaay.</p>
</div>
</div>
`);

  const asteriskButton = intro.querySelector(`.intro__asterisk`);

  asteriskButton.addEventListener(`click`, (evt) => {
    onNextButtonClick(evt, greeting());
  });

  return intro;
};
