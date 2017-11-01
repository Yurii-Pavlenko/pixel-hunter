import game2 from "../game2/game2";
import {stateData} from "../play-data";


export const game1Data = {
  jumpTo: {
    next: game2,
  },
  IMG_NUMBER: 2
};


export const renderAnswers1 = (question1, question2, img1, img2, answerType) => {
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

