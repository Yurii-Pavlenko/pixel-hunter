import game3 from "../game3/game3";
import {stateData} from "../play-data";

export const game2Date = {
/*  description: `Угадай, фото или рисунок?`, */
  jumpTo: {
    next: game3
  }/* ,
  pictures: [
    {
      imgSrc: `https://artrue.ru/wp-content/uploads/2017/02/yigal-ozeri-08.jpg`,
      imgType: `paint`
    },
    {
      imgSrc: `http://fotografy.ru/wp-content/uploads/2015/01/1511.jpg`,
      imgType: `photo`
    },
    {
      imgSrc: `https://artrue.ru/wp-content/uploads/2017/02/yigal-ozeri-07.jpg`,
      imgType: `paint`
    },
    {
      imgSrc: `https://artrue.ru/wp-content/uploads/2017/02/yigal-ozeri-07.jpg`,
      imgType: `paint`
    },
    {
      imgSrc: `http://fotografy.ru/wp-content/uploads/2015/01/1511.jpg`,
      imgType: `photo`
    },
    {
      imgSrc: `https://artrue.ru/wp-content/uploads/2017/02/yigal-ozeri-07.jpg`,
      imgType: `paint`
    },
    {
      imgSrc: `https://artrue.ru/wp-content/uploads/2017/02/yigal-ozeri-07.jpg`,
      imgType: `paint`
    },
    {
      imgSrc: `https://artrue.ru/wp-content/uploads/2017/02/yigal-ozeri-08.jpg`,
      imgType: `paint`
    },
    {
      imgSrc: `http://fotografy.ru/wp-content/uploads/2015/01/1511.jpg`,
      imgType: `photo`
    },
    {
      imgSrc: `https://artrue.ru/wp-content/uploads/2017/02/yigal-ozeri-07.jpg`,
      imgType: `paint`
    },
    {
      imgSrc: `https://artrue.ru/wp-content/uploads/2017/02/yigal-ozeri-08.jpg`,
      imgType: `paint`
    },
    {
      imgSrc: `http://fotografy.ru/wp-content/uploads/2015/01/1511.jpg`,
      imgType: `photo`
    },
    {
      imgSrc: `https://artrue.ru/wp-content/uploads/2017/02/yigal-ozeri-07.jpg`,
      imgType: `paint`
    }
  ]*/
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
