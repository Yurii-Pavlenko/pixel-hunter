import getElementFromTemplate from "../utils/get-element-from-html";
import onNextButtonClick from "../utils/show-screen-handler";
import gameHeader from "./game-header";
import gameStats from "./game-stats";

export default (data) => {
  const game3 = getElementFromTemplate(`
  ${gameHeader(data.state)}
  <div class="game">
    <p class="game__task">${data.game3.description}</p>
    <form class="game__content  game__content--triple">
      <div class="game__option">
        <img src=${data.pictures[data.state.game].imgSrc} alt="Option 1" width="304" height="455">
      </div>
      <div class="game__option  game__option--selected">
        <img src=${data.pictures[data.state.game + 1].imgSrc} alt="Option 1" width="304" height="455">
      </div>
      <div class="game__option">
        <img src=${data.pictures[data.state.game + 2].imgSrc} alt="Option 1" width="304" height="455">
      </div>
    </form>
    ${gameStats(data)}
  </div>
`);
  const headerBack = game3.querySelector(`.header__back`);
  const gameContent = game3.querySelector(`.game__content`);

  gameContent.addEventListener(`click`, (evt) => {
    onNextButtonClick(evt, data.game3.jumpTo.next(data));
  });

  headerBack.addEventListener(`click`, (evt) => {
    onNextButtonClick(evt, data.game3.jumpTo.back(data));
  });

  return game3;
};
