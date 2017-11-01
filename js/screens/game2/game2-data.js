import game3 from "../game3/game3";
import {stateData} from "../play-data";

export const game2Date = {
  jumpTo: {
    next: game3
  },
  IMG_NUMBER: 1
};

export const renderAnswers2 = (question, picture, answerType) => {
  let answer = false;

  for (let i = 0; i < question.length; i++) {
    if (question[i].checked) {
      answer = question[i].getAttribute(`value`);
    }
  }

  if (answer === picture.imgType) {
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
