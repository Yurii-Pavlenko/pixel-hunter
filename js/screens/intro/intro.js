import getElementFromTemplate from "../../utils/get-element-from-html";
import greeting from "../greeting/greeting";
import renderScreen from "../../utils/screen-renderer";

const intro = getElementFromTemplate(`
<div id="main" class="central__content">
  <div id="intro" class="intro">
  <h1 class="intro__asterisk">*</h1>
  <p class="intro__motto"><sup>*</sup> Это не фото. Это рисунок маслом нидерландского художника-фотореалиста Tjalf Sparnaay.</p>
</div>
</div>
`);

const asteriskButton = intro.querySelector(`.intro__asterisk`);

asteriskButton.onclick = () => {
  renderScreen(greeting);
};

export default intro;
