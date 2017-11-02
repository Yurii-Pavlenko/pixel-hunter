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

/* const checkAnswer = (question) => {
  let answer = false;
  for (const item of question) {
    if (item.checked) {
      answer = item.getAttribute(`value`);
    } else {
      answer = false;
    }
  }
  return answer;
};*/
/*
const checkAnswer = (question) => {
  let answer = false;
  question.forEach((item) => {
    if (item.checked) {
      answer = item.getAttribute(`value`);
    }
    return answer;
  });
};*/


export const renderAnswers1 = (question1, question2, img1, img2, answerType) => {
  let answer1 = false;
  let answer2 = false;

  /*
  answer1 = checkAnswer(question1);
  answer2 = checkAnswer(question2);
*/

  for (const item of question1) {
    if (item.checked) {
      answer1 = item.getAttribute(`value`);
    }
  }

  for (const item of question2) {
    if (item.checked) {
      answer2 = item.getAttribute(`value`);
    }
  }

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
