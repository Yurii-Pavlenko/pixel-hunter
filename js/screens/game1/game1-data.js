import game2 from "../game2/game2";
import greeting from "../greeting/greeting";
import stats from "../stats/stats";
import data from "../play-data";

export const game1Data = {
  description: `Угадайте для каждого изображения фото или рисунок?`,
  jumpTo: {
    next: game2,
    back: greeting,
    end: stats
  },
  pictures: [
    {
      imgSrc: `https://k42.kn3.net/CF42609C8.jpg`,
      imgType: `paint`
    },
    {
      imgSrc: `http://i.imgur.com/1KegWPz.jpg`,
      imgType: `photo`
    },
    {
      imgSrc: `https://k42.kn3.net/D2F0370D6.jpg`,
      imgType: `paint`
    },
    {
      imgSrc: `https://i.imgur.com/DiHM5Zb.jpg`,
      imgType: `photo`
    },
    {
      imgSrc: `https://k32.kn3.net/5C7060EC5.jpg`,
      imgType: `paint`
    },
    {
      imgSrc: `http://img11.nnm.me/0/6/e/3/7/e2852af593102fac4066de970df.jpg`, // ``,
      imgType: `photo`
    },

    {
      imgSrc: `http://img1.liveinternet.ru/images/attach/c/4/82/641/82641433_large_1.jpg`,
      imgType: `paint`
    },
    {
      imgSrc: `http://cdn.fishki.net/upload/post/201601/13/1810183/1452629978_02.jpg`,
      imgType: `photo`
    }
  ]
};

export const renderAnswers = (question1, question2) => {
  let answer1 = false;
  let answer2 = false;
  for (let i = 0; i < question1.length; i++) {
    if (question1[i].checked) {
      answer1 = question1[i].getAttribute(`value`);
    }
  }
  for (let i = 0; i < question2.length; i++) {
    if (question2[i].checked) {
      answer2 = question2[i].getAttribute(`value`);
    }
  }
  if (answer1 === game1Data.pictures[data.state.game].imgType && answer2 === game1Data.pictures[data.state.game + 1].imgType) {
    const index = data.state.answers.findIndex((element) => {
      return element === `unknown`;
    });
    data.state.answers[index] = `correct`;
  } else {
    const index = data.state.answers.findIndex((element) => {
      return element === `unknown`;
    });
    data.state.answers[index] = `wrong`;
    data.state.lives -= 1;
  }
};

