import game2 from "../game2/game2";
// import greeting from "../greeting/greeting";
// import stats from "../stats/stats";
import {stateData} from "../play-data";


export const game1Data = {
  // description: `Угадайте для каждого изображения фото или рисунок?`,
  jumpTo: {
    next: game2,
  }
  /* ,
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
  ]*/
};


export const renderAnswers1 = (question1, question2, imgArray) => {
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
    stateData.answers[index] = `correct`;
  } else {
    const index = stateData.answers.findIndex((element) => {
      return element === `unknown`;
    });
    stateData.answers[index] = `wrong`;
    stateData.lives -= 1;
  }
};

