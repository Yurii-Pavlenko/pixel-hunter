/* import game3 from "../game3/game3";
import greeting from "../greeting/greeting";
import stats from "../stats/stats";*/
import {stateData} from "../play-data";

export const game2Date = {
/*  description: `Угадай, фото или рисунок?`,
  jumpTo: {
    next: game3,
    back: greeting,
    end: stats
  },*/
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
  ]
};

export const renderAnswers2 = (question) => {
  let answer = false;

  for (let i = 0; i < question.length; i++) {
    if (question[i].checked) {
      answer = question[i].getAttribute(`value`);
    }
  }

  if (answer === game2Date.pictures[stateData.game].imgType) {
    const index = stateData.answers.findIndex((element) => {
      return element === `unknown`;
    });
    stateData.answers[index] = `correct`;
  } else {
    const index = stateData.answers.findIndex((element) => {
      return element === `unknown`;
    });
    stateData.answers[index] = `wrong`;
    stateData.lives -= 1;
  }
};
