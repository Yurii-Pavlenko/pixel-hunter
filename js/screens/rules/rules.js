import getElementFromTemplate from "../../utils/get-element-from-html";
import onNextButtonClick from "../../utils/show-screen-handler";
// import rulesData from "./rules-data";
import game1 from "../game1/game1";
import greeting from "../greeting/greeting";
import renderScreen from "../../utils/screen-renderer";

export default () => {
  const rules = getElementFromTemplate(`
  <header class="header">
    <div class="header__back">
      <button class="back">
        <img src="img/arrow_left.svg" width="45" height="45" alt="Back">
        <img src="img/logo_small.svg" width="101" height="44">
      </button>
    </div>
  </header>
  <div class="rules">
    <h1 class="rules__title">Правила</h1>
    <p class="rules__description">Угадай 10 раз для каждого изображения фото <img
      src="img/photo_icon.png" width="16" height="16"> или рисунок <img
      src="img/paint_icon.png" width="16" height="16" alt="">.<br>
      Фотографиями или рисунками могут быть оба изображения.<br>
      На каждую попытку отводится 30 секунд.<br>
      Ошибиться можно не более 3 раз.<br>
      <br>
      Готовы?</p>
    <form class="rules__form">
      <input class="rules__input" type="text" placeholder="Ваше Имя">
      <button class="rules__button  continue" type="submit" disabled>Go!</button>
    </form>
  </div>
`);

  const headerBack = rules.querySelector(`.back`);
  const rulesForm = rules.querySelector(`.rules__form`);
  const rulesInput = rulesForm.querySelector(`.rules__input`);
  const rulesButton = rulesForm.querySelector(`.rules__button`);

  rulesInput.addEventListener(`input`, () => {
    rulesButton.disabled = !rulesInput.value;
  });

  rulesForm.addEventListener(`submit`, (evt) => {
    onNextButtonClick(evt, game1());
  });
  /*

  headerBack.addEventListener(`click`, (evt) => {
    onNextButtonClick(evt, greeting());
  });
*/
  headerBack.onclick = () => renderScreen(greeting());

  return rules;
};