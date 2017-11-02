import AbstractView from "../../utils/abstract-view";

export default class RulesView extends AbstractView {

  get template() {
    return `<header class="header">
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
      `;
  }

  bind() {
    const headerBack = this.element.querySelector(`.back`);
    const rulesForm = this.element.querySelector(`.rules__form`);
    const rulesInput = this.element.querySelector(`.rules__input`);
    const rulesButton = this.element.querySelector(`.rules__button`);

    rulesInput.addEventListener(`input`, (evt) => {
      evt.preventDefault();
      rulesButton.disabled = !rulesInput.value;
    });

    rulesForm.addEventListener(`submit`, (evt) => {
      evt.preventDefault();
      this.onButtonClick();
    });

    headerBack.addEventListener(`click`, this.onBackClick);
  }

  onButtonClick() {

  }

  onBackClick() {

  }
}
