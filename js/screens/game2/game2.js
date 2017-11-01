import {getPictures} from "../../utils/get-pictures";
import pictures from "../../utils/pictures";
import {game2Date} from "./game2-data";
import Game2View from "./game2-view";
import {goBack, stateData} from "../play-data";
import gameStats from "../game-stats";
import checkNext from "../../utils/check-next";

export default () => {
  const img = getPictures(pictures, game2Date);

  const game2 = new Game2View(stateData, gameStats, img);

  game2.onButtonClick = () => checkNext(stateData, game2Date);
  game2.onBackClick = () => goBack(stateData);

  return game2;
};

/* import getElementFromTemplate from "../../utils/get-element-from-html";
import gameHeader from "../game-header-view";
import gameStats from "../game-stats";
import {game2Date, renderAnswers2} from "./game2-data";
import {stateData, goBack, chooseAnswerType} from "../play-data";
import {getPictures} from "../../utils/get-pictures";
import pictures from "../../utils/pictures";
import checkNext from "../../utils/check-next";

const IMG_NUMBER = 1;
export default () => {
  const picture = getPictures(pictures, IMG_NUMBER);
  const game2 = getElementFromTemplate(`
  ${gameHeader(stateData)}
  <div class="game">
    <p class="game__task">Угадай, фото или рисунок?</p>
    <form class="game__content  game__content--wide">
      <div class="game__option">
        <img src=${picture.imgSrc} alt="Option 1" width="705" height="455">
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
    ${gameStats(stateData)}
  </div>
`);
  const headerBack = game2.querySelector(`.header__back`);
  const gameContent = game2.querySelector(`.game__content`);
  const question1 = game2.querySelectorAll(`input[name=question1]`);

  gameContent.addEventListener(`change`, () =>{
    renderAnswers2(question1, picture, chooseAnswerType());
    checkNext(stateData, game2Date);
  });

  headerBack.onclick = () => {
    goBack(stateData);
  };

  return game2;
};*/
