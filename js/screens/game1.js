import getElementFromTemplate from "../utils/get-element-from-html";
import onNextButtonClick from "../utils/show-screen-handler";
import gameHeader from "./game-header";
import gameStats from "./game-stats";

export default (data) => {
  const game1 = getElementFromTemplate(`
  ${gameHeader(data.state)}
  <div class="game">
    <p class="game__task">${data.game1.description}</p>
    <form class="game__content">
      <div class="game__option">
        <img src=${data.pictures[data.state.game].imgSrc} alt="Option 1" width="468" height="458">
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
        <img src=${data.pictures[data.state.game + 1].imgSrc} alt="Option 2" width="468" height="458">
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
  const answersQuantity = 2;
  const quantity = {
    unknownAnswers: data.state.answers.filter((element) =>{
      return element === `unknown`;
    }),
    wrongAnswers: data.state.answers.filter((element) =>{
      return element === `wrong`;
    })
  };

  const answers = () => {
    return gameContent.querySelectorAll(`input[type="radio"]:checked`).length;
  };
  // && quantity.wrongAnswers.length < 4 && quantity.unknownAnswers.length
  gameContent.addEventListener(`change`, (evt) => {
    if (!quantity.unknownAnswers.length && answers() === answersQuantity) {
      onNextButtonClick(evt, data.game1.jumpTo.end(data));
    } else if (quantity.wrongAnswers.length === 4 && answers() === answersQuantity) {
      onNextButtonClick(evt, data.game1.jumpTo.end(data));
    } else if (answers() === answersQuantity) {
      onNextButtonClick(evt, data.game1.jumpTo.next(data));
      data.state.game += 2;
    }
  });

  headerBack.addEventListener(`click`, (evt) => {
    onNextButtonClick(evt, data.game1.jumpTo.back(data));
  });

  return game1;
};
