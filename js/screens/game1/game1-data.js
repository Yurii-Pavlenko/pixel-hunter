import game2 from "../game2/game2";
import {stateData} from "../play-data";
import stats from "../stats/stats";
import renderScreen from "../../utils/screen-renderer";

const endOfGame = 10;


export const game1Data = {
  jumpTo: {
    next: game2,
  },
  IMG_NUMBER: 2
};

const checkAnswer = (question) => {
  let answer = false;
  for (let i = 0; i < question.length; i++) {
    if (question[i].checked) {
      answer = question[i].getAttribute(`value`);
    }
  }
  return answer;
};

export const renderAnswers1 = (question1, question2, img1, img2, answerType) => {

  let answer1 = checkAnswer(question1);
  let answer2 = checkAnswer(question2);

  if (answer1 === img1.imgType && answer2 === img2.imgType) {
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

export const checkNext1 = () => {

  if (stateData.lives < 0) {
    stateData.victory = false;
    renderScreen(stats());
  } else if (stateData.gameNumber === endOfGame) {
    stateData.victory = true;
    renderScreen(stats());
  } else {
    renderScreen(game2());
  }
};
