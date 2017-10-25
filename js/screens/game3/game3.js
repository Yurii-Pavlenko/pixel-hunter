import getElementFromTemplate from "../../utils/get-element-from-html";
// import onNextButtonClick from "../../utils/show-screen-handler";
import gameHeader from "../game-header";
import gameStats from "../game-stats";
import {game3Data, renderAnswers3} from "./game3-data";
import {stateData} from "../play-data";
import greeting from "../greeting/greeting";
import game1 from "../game1/game1";
import renderScreen from "../../utils/screen-renderer";

export default () => {
  const game3 = getElementFromTemplate(`
  ${gameHeader(stateData)}
  <div class="game">
    <p class="game__task">${game3Data.description}</p>
    <form class="game__content  game__content--triple">
      <div class="game__option">
        <img src=${game3Data.pictures[stateData.game].imgSrc} alt="Option 1" width="304" height="455">
      </div>
      <div class="game__option">
        <img src=${game3Data.pictures[stateData.game + 1].imgSrc} alt="Option 1" width="304" height="455">
      </div>
      <div class="game__option">
        <img src=${game3Data.pictures[stateData.game + 2].imgSrc} alt="Option 1" width="304" height="455">
      </div>
    </form>
    ${gameStats(stateData)}
  </div>
`);
  const headerBack = game3.querySelector(`.header__back`);
  const gameContent = Array.from(game3.querySelectorAll(`.game__option`));
  const questions = [];

  gameContent.forEach((option) => {
    option.onclick = () => {
      option.classList.add(`game__option--selected`);
      const answers3 = gameContent.map((opt) => {
        return (opt.classList.contains(`game__option--selected`)) ? `paint` : `photo`;
      });
      for (let i = 0; i < answers3.length; i++) {
        questions.push(game3Data.pictures[stateData.game + i].imgType);
      }
      renderAnswers3(questions, answers3);
      renderScreen(game1());
    };
  });

  headerBack.onclick = () => renderScreen(greeting());

  return game3;
};
