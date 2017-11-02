import {stateData} from "../play-data";
import game1 from "../game1/game1";
import stats from "../stats/stats";
import renderScreen from "../../utils/screen-renderer";

const endOfGame = 10;

export const game3Data = {
  IMG_NUMBER: 3
};

export const renderAnswers3 = (questions, answers3, answerType) => {
  const isCorrect = questions.every((elem, i) => {
    return elem === answers3[i];
  });
  if (isCorrect) {
    const index = stateData.answers.findIndex((element) => {
      return element === `unknown`;
    });
    stateData.answers[index] = answerType;
  } else {
    const index = stateData.answers.findIndex((element) => {
      return element === `unknown`;
    });
    stateData.answers[index] = `wrong`;
    stateData.lives -= 1;
  }
  stateData.gameNumber += 1;
};

export const checkNext3 = () => {
  if (stateData.lives < 0) {
    stateData.victory = false;
    renderScreen(stats());
  } else if (stateData.gameNumber === endOfGame) {
    stateData.victory = true;
    renderScreen(stats());
  } else {
    renderScreen(game1());
  }
};
