import getElementFromTemplate from "../../utils/get-element-from-html";
import onNextButtonClick from "../../utils/show-screen-handler";
import gameHeader from "../game-header";
import gameStats from "../game-stats";
import {game3Data} from "./game3-data";
import data from "../play-data";
import greeting from "../greeting/greeting";
import game1 from "../game1/game1";

export default () => {
  const game3 = getElementFromTemplate(`
  ${gameHeader(data.state)}
  <div class="game">
    <p class="game__task">${game3Data.description}</p>
    <form class="game__content  game__content--triple">
      <div class="game__option">
        <img src=${game3Data.pictures[data.state.game].imgSrc} alt="Option 1" width="304" height="455">
      </div>
      <div class="game__option  game__option--selected">
        <img src=${game3Data.pictures[data.state.game + 1].imgSrc} alt="Option 1" width="304" height="455">
      </div>
      <div class="game__option">
        <img src=${game3Data.pictures[data.state.game + 2].imgSrc} alt="Option 1" width="304" height="455">
      </div>
    </form>
    ${gameStats(data)}
  </div>
`);
  const headerBack = game3.querySelector(`.header__back`);
  const gameContent = game3.querySelector(`.game__content`);

  gameContent.addEventListener(`click`, (evt) => {
    onNextButtonClick(evt, game1());
  });

  headerBack.addEventListener(`click`, (evt) => {
    onNextButtonClick(evt, greeting());
  });

  return game3;
};
