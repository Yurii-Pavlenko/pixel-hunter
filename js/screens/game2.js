import getElementFromTemplate from "../utils/get-element-from-html";
import onNextButtonClick from "../utils/show-screen-handler";
import gameHeader from "./game-header";
import gameStats from "./game-stats";

export default (data) => {
  const game2 = getElementFromTemplate(`
  ${gameHeader(data.state)}
  <div class="game">
    <p class="game__task">${data.game2.description}</p>
    <form class="game__content  game__content--wide">
      <div class="game__option">
        <img src=${data.pictures[data.state.game].imgSrc} alt="Option 1" width="705" height="455">
        <label class="game__answer  game__answer--photo">
          <input name="question1" type="radio" value="photo">
          <span>Фото</span>
        </label>
        <label class="game__answer  game__answer--wide  game__answer--paint">
          <input name="question1" type="radio" value="paint">
          <span>Рисунок</span>
        </label>
      </div>
    </form>
    ${gameStats(data)}
  </div>
`);
  const headerBack = game2.querySelector(`.header__back`);
  const gameContent = game2.querySelector(`.game__content`);

  const answers = () => {
    return gameContent.querySelectorAll(`input[type="radio"]:checked`).length;
  };

  gameContent.addEventListener(`change`, (evt) => {
    if (answers()) {
      onNextButtonClick(evt, data.game2.jumpTo.next(data));
    }
  });

  headerBack.addEventListener(`click`, (evt) => {
    onNextButtonClick(evt, data.game2.jumpTo.back(data));
  });

  return game2;
};
