import getElementFromTemplate from "../utils/get-element-from-html";
import onNextButtonClick from "../utils/show-screen-handler";

export default (data) => {
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
    <p class="rules__description">${data.rules.description}</p>
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
    onNextButtonClick(evt, data.rules.jumpTo.next(data));
  });

  headerBack.addEventListener(`click`, (evt) => {
    onNextButtonClick(evt, data.rules.jumpTo.back(data));
  });

  return rules;
};
