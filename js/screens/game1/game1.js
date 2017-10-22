import getElementFromTemplate from "../../utils/get-element-from-html";
import onNextButtonClick from "../../utils/show-screen-handler";
import gameHeader from "../game-header";
import gameStats from "../game-stats";
import data from "../play-data";
import {game1Data, renderAnswers} from "./game1-data";

export default () => {
  const game1 = getElementFromTemplate(`
  ${gameHeader(data.state)}
  <div class="game">
    <p class="game__task">Угадайте для каждого изображения фото или рисунок?</p>
    <form class="game__content">
      <div class="game__option">
        <img src=${game1Data.pictures[data.state.game].imgSrc} alt="Option 1" width="468" height="458">
        <label class="game__answer game__answer--photo">
          <input name="question1" type="radio" value="photo">
          <span>Фото</span>
        </label>
        <label class="game__answer game__answer--paint">
          <input name="question1" type="radio" value="paint">
          <span>Рисунок</span>
        </label>
      </div>
      <div class="game__option">
        <img src=${game1Data.pictures[data.state.game + 1].imgSrc} alt="Option 2" width="468" height="458">
        <label class="game__answer  game__answer--photo">
          <input name="question2" type="radio" value="photo">
          <span>Фото</span>
        </label>
        <label class="game__answer  game__answer--paint">
          <input name="question2" type="radio" value="paint">
          <span>Рисунок</span>
        </label>
      </div>
    </form>
    ${gameStats(data)}
  </div>
`);
  const headerBack = game1.querySelector(`.header__back`);
  const gameContent = game1.querySelector(`.game__content`);
  const question1 = game1.querySelectorAll(`input[name=question1]`);
  const question2 = game1.querySelectorAll(`input[name=question2]`);
  const enoughQuantity = 2;
  const getOffGame = 4;
  const quantity = {
    unknownAnswers: data.state.answers.filter((element) =>{
      return element === `unknown`;
    }),
    wrongAnswers: data.state.answers.filter((element) =>{
      return element === `wrong`;
    })
  };


  const needQuantity = () => {
    return gameContent.querySelectorAll(`input[type="radio"]:checked`).length;
  };

  gameContent.addEventListener(`change`, (evt) => {
    if (!quantity.unknownAnswers.length && needQuantity() === enoughQuantity ||
      quantity.wrongAnswers.length === getOffGame && needQuantity() === enoughQuantity) {
      onNextButtonClick(evt, game1Data.jumpTo.end(data));
    } else if (needQuantity() === enoughQuantity) {
      renderAnswers(question1, question2, game1Data);
      data.state.game += 2;
      onNextButtonClick(evt, game1Data.jumpTo.next(data));
    }
  });

  headerBack.addEventListener(`click`, (evt) => {
    onNextButtonClick(evt, game1Data.jumpTo.back(data));
  });

  return game1;
};
