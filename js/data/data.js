import greeting from "../screens/greeting";
import rules from "../screens/rules";
import game1 from "../screens/game1";
import game2 from "../screens/game2";
import game3 from "../screens/game3";
import stats from "../screens/stats";


export default {
  intro: {
    description: ` Это не фото. Это рисунок маслом нидерландского художника-фотореалиста Tjalf Sparnaay.`,
    jumpTo: {
      next: greeting
    }
  },
  greeting: {
    description: `<h3>Лучшие художники-фотореалисты бросают&nbsp;тебе&nbsp;вызов!</h3>
      <p>Правила игры просты.<br>
        Нужно отличить рисунок&nbsp;от фотографии и сделать выбор.<br>
        Задача кажется тривиальной, но не думай, что все так просто.<br>
        Фотореализм обманчив и коварен.<br>
        Помни, главное — смотреть очень внимательно.</p>`,
    jumpTo: {
      next: rules
    }
  },
  rules: {
    description: `Угадай 10 раз для каждого изображения фото <img
      src="img/photo_icon.png" width="16" height="16"> или рисунок <img
      src="img/paint_icon.png" width="16" height="16" alt="">.<br>
      Фотографиями или рисунками могут быть оба изображения.<br>
      На каждую попытку отводится 30 секунд.<br>
      Ошибиться можно не более 3 раз.<br>
      <br>
      Готовы?`,
    jumpTo: {
      next: game1,
      back: greeting
    }
  },
  game1: {
    description: `Угадайте для каждого изображения фото или рисунок?`,
    jumpTo: {
      next: game2,
      back: greeting,
      end: stats
    }
  },
  game2: {
    description: `Угадай, фото или рисунок?`,
    jumpTo: {
      next: game3,
      back: greeting,
      end: stats
    }
  },
  game3: {
    description: `Найдите рисунок среди изображений`,
    jumpTo: {
      next: game1,
      back: greeting,
      end: stats
    }
  },
  stats: {
    description: ``,
    jumpTo: {
      back: greeting
    }
  },
  state: {
    game: 0,
    lives: 2,
    time: 18,
    answers: [`wrong`, `wrong`, `slow`, `fast`, `correct`, `correct`, `correct`, `correct`, `correct`, `unknown`]
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
      imgSrc: `http://i.imgur.com/DKR1HtB.jpg`,
      imgType: `photo`
    },

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
      imgSrc: `http://i.imgur.com/DKR1HtB.jpg`,
      imgType: `photo`
    },

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
      imgSrc: `http://i.imgur.com/DKR1HtB.jpg`,
      imgType: `photo`
    }
  ]
};

