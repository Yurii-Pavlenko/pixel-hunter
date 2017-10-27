import getElementFromTemplate from "../../utils/get-element-from-html";
import gameHeader from "../game-header";
import gameStats from "../game-stats";
import {game3Data, renderAnswers3, checkNext3} from "./game3-data";
import {goBack, stateData} from "../play-data";
import {getPictures} from "../../utils/get-pictures";
import pictures from "../../utils/pictures";

const IMG_NUMBER = 3;
export default () => {
  const imgArray = getPictures(pictures, IMG_NUMBER);
  const game3 = getElementFromTemplate(`
  ${gameHeader(stateData)}
  <div class="game">
    <p class="game__task">${game3Data.description}</p>
    <form class="game__content  game__content--triple">
      <div class="game__option">
        <img src=${imgArray[0].imgSrc} alt="Option 1" width="304" height="455">
      </div>
      <div class="game__option">
        <img src=${imgArray[1].imgSrc} alt="Option 1" width="304" height="455">
      </div>
      <div class="game__option">
        <img src=${imgArray[2].imgSrc} alt="Option 1" width="304" height="455">
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
        questions.push(imgArray[i].imgType);
      }
      renderAnswers3(questions, answers3);
      checkNext3(stateData);
    };
  });

  headerBack.onclick = () => {
    goBack(stateData);
  };

  return game3;
};
