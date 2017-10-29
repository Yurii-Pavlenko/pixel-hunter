import game2 from "../game2/game2";
// import greeting from "../greeting/greeting";
// import stats from "../stats/stats";
import {stateData} from "../play-data";


export const game1Data = {
  jumpTo: {
    next: game2,
  },
  IMG_NUMBER: 2
};


export const renderAnswers1 = (question1, question2, imgArray, answerType) => {
  let answer1 = false;
  let answer2 = false;

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

  if (answer1 === imgArray[0].imgType && answer2 === imgArray[1].imgType) {
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

