import game3 from "../game3/game3";
import greeting from "../greeting/greeting";
import stats from "../stats/stats";

export const game2Date = {
  description: `Угадай, фото или рисунок?`,
  jumpTo: {
    next: game3,
    back: greeting,
    end: stats
  },
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
    }
  ]
};
