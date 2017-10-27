import {stateData} from "../play-data";
import game1 from "../game1/game1";

export const game3Data = {
  description: `Найдите рисунок среди изображений`,
  jumpTo: {
    next: game1
  }
/*
  pictures: [
    {
      imgSrc: `http://fotografy.ru/wp-content/uploads/2015/01/1711.jpg`,
      imgType: `photo`
    },

    {
      imgSrc: `https://artrue.ru/wp-content/uploads/2017/02/yigal-ozeri-06.jpg`,
      imgType: `paint`
    },
    {
      imgSrc: `http://fotografy.ru/wp-content/uploads/2015/01/1811.jpg`,
      imgType: `photo`
    },
    {
      imgSrc: `https://artrue.ru/wp-content/uploads/2017/02/yigal-ozeri-05.jpg`,
      imgType: `paint`
    },
    {
      imgSrc: `https://www.nrdc.org/sites/default/files/styles/full_content--retina/public/media-uploads/coms11_path_house_2400.jpg?itok=3nK5tmPF`,
      imgType: `photo`
    },
    {
      imgSrc: `http://i.imgur.com/DKR1HtB.jpg`,
      imgType: `photo`
    },
    {
      imgSrc: `https://artrue.ru/wp-content/uploads/2017/02/yigal-ozeri-03.jpg`,
      imgType: `paint`
    },
    {
      imgSrc: `http://fotografy.ru/wp-content/uploads/2015/01/1711.jpg`,
      imgType: `photo`
    },
    {
      imgSrc: `https://artrue.ru/wp-content/uploads/2017/02/yigal-ozeri-06.jpg`,
      imgType: `paint`
    }
  ]*/
};

export const renderAnswers3 = (questions, answers3) => {
  const isCorrect = questions.every((elem, i) => {
    return elem === answers3[i];
  });
  if (isCorrect) {
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
