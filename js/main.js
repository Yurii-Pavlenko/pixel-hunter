(function () {
'use strict';

const initialState = {
  lives: 3,
  time: 30,
  level: 0
};

const GameParameters = {
  MIN_COUNT_LIVES: 0,
  MIN_COUNT_TIME: 0,
  NUMBER_ANSWERS: 10,
  AMOUNT_MILISECONDS_IN_SECONDS: 1000
};

const amountPoints = {
  CORRECT_ANSWER: 100,
  BONUS_FOR_FAST_ANSWER: 50,
  BONUS_FOR_SLOW_ANSWER: -50,
  BONUS_FOR_LIVES_LEFT: 50
};

const main = document.querySelector(`.central`);

class Utils {
  static getElementFromTemplate(murkup) {
    const template = document.createElement(`template`);
    template.innerHTML = murkup;
    return template.content;
  }

  static clearElement(parent) {
    while (parent.firstChild) {
      parent.removeChild(parent.firstChild);
    }
  }

  static displayElement(newElement, parent, clear = false) {
    if (clear) {
      this.clearElement(parent);
    }
    if (parent.firstElementChild) {
      parent.insertBefore(newElement, parent.firstElementChild);
      return;
    }
    parent.appendChild(newElement);
  }

  static displayScreen(newElement) {
    this.displayElement(newElement, main, true);
  }

  static getLevel(level, data) {
    return data[level];
  }

  static getStats(listAnswers) {
    const stats = [`<ul class="stats">`];
    listAnswers.forEach((item) => {
      stats.push(`<li class="stats__result stats__result--${item}"></li>`);
    });

    const amountUnknownAnswers = GameParameters.NUMBER_ANSWERS - listAnswers.length;
    for (let i = 0; i < amountUnknownAnswers; i++) {
      stats.push(`<li class="stats__result stats__result--unknown"></li>`);
    }
    stats.push(`</ul>`);
    return stats.join(` `);
  }

  static countOfPoints(amount, points) {
    return amount * points;
  }

  static resize(image, defaultParameters) {
    const ratioImage = image.width / image.height;

    let newWidth = defaultParameters.WIDTH;
    let newHeight = newWidth / ratioImage;
    if (newHeight <= defaultParameters.HEIGHT) {
      return {
        width: newWidth,
        height: newHeight
      };
    }

    newHeight = defaultParameters.HEIGHT;
    newWidth = newHeight * ratioImage;
    return {
      width: newWidth,
      height: newHeight
    };
  }

  static getImageParameters(buffer, url) {
    const imageBuffer = buffer.find((image) => image.src === url);
    return {
      width: imageBuffer.width,
      height: imageBuffer.height
    };
  }
}

class AbstractView {
  get template() {
    throw new Error(`You have to define template for view!`);
  }

  get element() {
    if (!this._element) {
      this._element = this.render();
    }
    const element = this._element.cloneNode(true);
    this.bind(element);
    return element;
  }

  bind() {

  }

  render() {
    return Utils.getElementFromTemplate(this.template);
  }

}

class GreetingView extends AbstractView {
  constructor() {
    super();
  }

  get template() {
    return (
      `<div class="greeting">
        <div class="greeting__logo"><img src="img/logo_big.png" width="201" height="89" alt="Pixel Hunter"></div>
        <h1 class="greeting__asterisk">*</h1>
        <div class="greeting__challenge">
          <h3>Лучшие художники-фотореалисты бросают&nbsp;тебе&nbsp;вызов!</h3>
          <p>Правила игры просты.<br>
            Нужно отличить рисунок&nbsp;от фотографии и сделать выбор.<br>
            Задача кажется тривиальной, но не думай, что все так просто.<br>
            Фотореализм обманчив и коварен.<br>
            Помни, главное — смотреть очень внимательно.</p>
        </div>
        <div class="greeting__continue"><span><img src="img/arrow_right.svg" width="64" height="64" alt="Next"></span></div>
      </div>`
    );
  }

  bind(element) {
    const buttonContinue = element.querySelector(`.greeting__continue`);
    buttonContinue.onclick = (evt) => this.continueHandler(evt);

    const greeting = element.querySelector(`.greeting`);
    window.setTimeout(() => {
      greeting.classList.add(`central--blur`);
    }, 10);
  }
}

class GreetingScreen {
  constructor() {
    this.view = new GreetingView();
  }

  init() {
    this.view.continueHandler = () => {
      Application.showRulesScreen();
    };

    Utils.displayScreen(this.view.element);
  }
}

var greetingScreen = new GreetingScreen();

const IMAGE_PARAMETERS = {
  WIDTH: 468,
  HEIGHT: 458
};

class LevelFirstTypeView extends AbstractView {
  constructor(gameView) {
    super();

    this.answerHandler = gameView.firstLevelType.answerHandler;
    this.imagesBuffer = gameView.model.imagesBuffer;
    this.currentLevel = gameView.model.data[gameView.model.state.level];
  }

  get template() {
    return (
      `<p class="game__task">${this.currentLevel.question}</p>
      <form class="game__content">
        ${this.templateGameOptions}
      </form>`
    );
  }

  templateOption(url, index) {
    const imageParameters = Utils.getImageParameters(this.imagesBuffer, url);
    const newImageParameters = Utils.resize(imageParameters, IMAGE_PARAMETERS);

    return (
      `<div class="game__option">
        <img src="${url}" alt="Option ${index + 1}" width="${newImageParameters.width}" height="${newImageParameters.height}">
        <label class="game__answer game__answer--photo">
          <input name="question${index + 1}" type="radio" value="photo">
          <span>Фото</span>
        </label>
        <label class="game__answer game__answer--paint">
          <input name="question${index + 1}" type="radio" value="paint">
          <span>Рисунок</span>
        </label>
      </div>`
    );
  }

  get templateGameOptions() {
    return this.currentLevel.images.map((item, index) => {
      return this.templateOption(item.url, index);
    }).join(` `);
  }

  bind(element) {
    const form = element.querySelector(`.game__content`);

    const radioButtons = form.querySelectorAll(`input[type='radio']`);
    [...radioButtons].forEach((radio) => {
      radio.onchange = (evt) => this.answerHandler(evt, form);
    });
  }
}

const IMAGE_PARAMETERS$1 = {
  WIDTH: 705,
  HEIGHT: 455
};

class LevelSecondTypeView extends AbstractView {
  constructor(gameView) {
    super();

    this.answerHandler = gameView.secondLevelType.answerHandler;
    this.imagesBuffer = gameView.model.imagesBuffer;
    this.currentLevel = gameView.model.data[gameView.model.state.level];
  }

  get template() {
    const imageParameters = Utils.getImageParameters(this.imagesBuffer,
        this.currentLevel.image.url);
    const newImageParameters = Utils.resize(imageParameters, IMAGE_PARAMETERS$1);

    return (
      `<p class="game__task">Угадай, фото или рисунок?</p>
      <form class="game__content  game__content--wide">
        <div class="game__option">
          <img src="${this.currentLevel.image.url}" alt="Option 1" width="${newImageParameters.width}" height="${newImageParameters.height}">
          <label class="game__answer  game__answer--photo">
            <input name="question1" type="radio" value="photo">
            <span>Фото</span>
          </label>
          <label class="game__answer  game__answer--wide  game__answer--paint">
            <input name="question1" type="radio" value="paint">
            <span>Рисунок</span>
          </label>
        </div>
      </form>`
    );
  }

  bind(element) {
    const radioButtons = element.querySelectorAll(`input[type='radio']`);
    [...radioButtons].forEach((radio) => {
      radio.onclick = (evt) => this.answerHandler(evt, [...radioButtons]);
    });
  }
}

const IMAGE_PARAMETERS$2 = {
  WIDTH: 304,
  HEIGHT: 455
};

class LevelThirdTypeView extends AbstractView {
  constructor(gameView) {
    super();

    this.answerHandler = gameView.thirdLevelType.answerHandler;
    this.imagesBuffer = gameView.model.imagesBuffer;
    this.currentLevel = gameView.model.data[gameView.model.state.level];
  }

  get template() {
    return (
      `<p class="game__task">${this.currentLevel.question}</p>
      <form class="game__content  game__content--triple">
        ${this.templateGameOptions}
      </form>`
    );
  }

  templateOption(url, index) {
    const imageParameters = Utils.getImageParameters(this.imagesBuffer, url);
    const newImageParameters = Utils.resize(imageParameters, IMAGE_PARAMETERS$2);

    return (
      `<div class="game__option">
        <img src="${url}" alt="Option ${index + 1}" width="${newImageParameters.width}" height="${newImageParameters.height}">
      </div>`
    );
  }

  get templateGameOptions() {
    return this.currentLevel.images.map((item, index) => {
      return this.templateOption(item.url, index);
    }).join(` `);
  }

  bind(element) {
    const options = element.querySelectorAll(`.game__option`);
    [...options].forEach((option) => {
      option.onclick = (evt) => this.answerHandler(evt);
    });
  }
}

const TypeOfLevels = {
  FIRST: `first`,
  SECOND: `second`,
  THIRD: `third`
};

const routesLevel = {
  [TypeOfLevels.FIRST]: LevelFirstTypeView,
  [TypeOfLevels.SECOND]: LevelSecondTypeView,
  [TypeOfLevels.THIRD]: LevelThirdTypeView
};

class GameView extends AbstractView {
  constructor(model) {
    super();
    this.model = model;
  }

  get template() {
    return (
      `<header class="header"></header>
      <div class="game">
        <div class="stats">
          ${Utils.getStats(this.model.state.answers)}
        </div>
      </div>`
    );
  }

  bind(element) {
    this.header = element.querySelector(`.header`);
    displayHeader(this);

    this.levelContainer = element.querySelector(`.game`);
    this.updateLevel();
  }

  updateLevel() {
    const currentTypeLevel = this.model.currentLevel.type;
    const level = new routesLevel[currentTypeLevel](this).element;
    Utils.displayElement(level, this.levelContainer);
  }
}

class PlayerView extends AbstractView {
  constructor(view) {
    super();

    this.view = view;
    this.buttonBackHandler = view.player.buttonBackHandler;
  }

  get template() {
    return (
      `<div class="header__back">
        <button class="back">
          <img src="img/arrow_left.svg" width="45" height="45" alt="Back">
          <img src="img/logo_small.svg" width="101" height="44">
        </button>
      </div>
      ${this.templateTimer}
      ${this.templateLives}`
    );
  }

  get templateTimer() {
    if (!(this.view instanceof GameView)) {
      return ``;
    }
    return `<h1 class="game__timer">NN</h1>`;
  }

  get templateLives() {
    if (!(this.view instanceof GameView)) {
      return ``;
    }

    const lives = [];
    for (let i = 0; i < initialState.lives - this.view.model.state.lives; i++) {
      lives.push(`<img src="img/heart__empty.svg" class="game__heart" alt="Life" width="32" height="32">`);
    }
    for (let j = 0; j < this.view.model.state.lives; j++) {
      lives.push(`<img src="img/heart__full.svg" class="game__heart" alt="Life" width="32" height="32">`);
    }

    return `<div class="game__lives">${lives.join(` `)}</div>`;
  }

  displayTimer() {
    if (this.state.time <= 5) {
      this.timer.classList.add(`game__timer--small-time`);
    }
    this.timer.textContent = this.state.time;
  }

  tick() {
    this.displayTimer();
    this.state.timerId = window.setTimeout(() => {
      --this.state.time;

      if (this.state.time > GameParameters.MIN_COUNT_TIME) {
        this.tick();
        return;
      }
      this.view.player.tick();

    }, GameParameters.AMOUNT_MILISECONDS_IN_SECONDS);
  }

  bind(element) {
    const buttonBack = element.querySelector(`.back`);
    buttonBack.onclick = (evt) => this.buttonBackHandler(evt);

    const timer = element.querySelector(`.game__timer`);
    if (timer) {
      this.timer = timer;
      this.state = this.view.model.state;
      this.tick();
    }
  }
}

const displayHeader = (view) => {
  const player = new PlayerView(view).element;
  Utils.displayElement(player, view.header);
};

class RulesView extends AbstractView {
  constructor() {
    super();
  }

  get template() {
    return (
      `<header class="header"></header>
      <div class="rules">
        <h1 class="rules__title">Правила</h1>
        <p class="rules__description">Угадай 10 раз для каждого изображения фото <img
          src="img/photo_icon.png" width="16" height="16"> или рисунок <img
          src="img/paint_icon.png" width="16" height="16" alt="">.<br>
          Фотографиями или рисунками могут быть оба изображения.<br>
          На каждую попытку отводится 30 секунд.<br>
          Ошибиться можно не более 3 раз.<br>
          <br>
          Готовы?
        </p>
        <form class="rules__form">
          <input class="rules__input" type="text" placeholder="Ваше Имя" required>
          <button class="rules__button  continue" type="submit" disabled>Go!</button>
        </form>
      </div>`
    );
  }

  bind(element) {
    this.header = element.querySelector(`.header`);
    displayHeader(this);

    const form = element.querySelector(`.rules__form`);
    form.onsubmit = (evt) => this.formSubmitHandler(evt);

    const input = element.querySelector(`.rules__input`);
    input.oninput = (evt) => this.ckeckedInput(evt);
  }
}

class PlayerScreen {
  init(gameView) {
    this.buttonBackHandler = (evt) => {
      evt.preventDefault();
      Application.showGreetingScreen();
      if (gameView) {
        window.clearTimeout(gameModel.state.timerId);
      }
    };

    if (!gameView) {
      return this;
    }

    const gameModel = gameView.model;

    this.tick = () => {
      if (gameModel.state.time > GameParameters.MIN_COUNT_TIME) {
        return;
      }
      --gameModel.state.lives;
      ++gameModel.state.level;
      gameModel.addAnswer(false);

      if (!gameModel.isCanPlay()) {
        Application.showStatsScreen(gameModel.state);
        return;
      }
      Application.showGameScreen(gameModel.state);
    };

    return this;
  }
}

var player = new PlayerScreen();

const AMOUNT_SIMBOLS = 2;

class RulesScreen {
  constructor() {
    this.view = new RulesView();
  }

  init() {
    this.view.ckeckedInput = (evt) => {
      evt.preventDefault();
      const value = evt.currentTarget.value;

      const form = evt.currentTarget.parentElement;
      const rulesButton = form.querySelector(`.rules__button`);
      rulesButton.disabled = true;

      if (!this.checkInput(value)) {
        return;
      }
      this.value = value;
      rulesButton.disabled = false;
    };

    this.view.formSubmitHandler = (evt) => {
      evt.preventDefault();

      const state = Object.assign({}, initialState);
      state.answers = [];
      state.name = this.value;

      Application.showGameScreen(state);
    };

    this.view.player = player.init();

    Utils.displayScreen(this.view.element);
  }

  checkInput(value) {
    const checkedSimbols = /[{}*<>,.?!@#$:;%^&'"\\|/\s]/;
    const resultCheckSimbols = !checkedSimbols.test(value);

    return (
      value.length >= AMOUNT_SIMBOLS &&
      resultCheckSimbols
    );
  }
}

var rulesScreen = new RulesScreen();

const timeAnswers = {
  FAST: 10,
  SLOW: 20
};

class GameModel {
  constructor(data, imagesBuffer) {
    this.data = data;
    this.imagesBuffer = imagesBuffer;
  }

  updateState(newState) {
    this.state = newState;
    this.resetTimer();
  }

  resetTimer() {
    this.state.time = initialState.time;
  }

  isCanPlay() {
    return (
      (this.state.level < GameParameters.NUMBER_ANSWERS) &&
      (this.state.answers.length < GameParameters.NUMBER_ANSWERS) &&
      (this.state.lives >= GameParameters.MIN_COUNT_LIVES)
    );
  }

  get currentLevel() {
    return Utils.getLevel(this.state.level, this.data);
  }

  static getTypeAnswer(answer, time) {
    if (!answer) {
      return `wrong`;
    }
    if (time < timeAnswers.FAST) {
      return `fast`;
    }
    if (time >= timeAnswers.FAST && time < timeAnswers.SLOW) {
      return `correct`;
    }
    if (time >= timeAnswers.SLOW && time < initialState.time) {
      return `slow`;
    }
    return `wrong`;
  }

  addAnswer(answer, time) {
    time = (new Date() - time) / GameParameters.AMOUNT_MILISECONDS_IN_SECONDS;
    const type = GameModel.getTypeAnswer(answer, time);
    this.state.answers.push(type);
  }
}

class LevelFirstTypeScreen {
  init(gameView) {
    this.gameModel = gameView.model;
    this.currentLevel = this.gameModel.currentLevel;

    this.answerHandler = (evt, form) => {
      evt.preventDefault();

      const gameOptions = form.querySelectorAll(`.game__option`);
      if (!LevelFirstTypeScreen.checkForm(gameOptions)) {
        return;
      }

      const answer = this.getAnswer(gameOptions);
      gameView.showNextScreen(answer);
    };

    return this;
  }

  static checkForm(gameOptions) {
    return [...gameOptions].every((option) => {
      const groupRadios = option.querySelectorAll(`input[type='radio']`);
      return [...groupRadios].some((radio) => radio.checked);
    });
  }

  getAnswer(gameOptions) {
    return [...gameOptions].every((option, index) => {
      const imageType = this.currentLevel.images[index].type;
      const groupRadios = option.querySelectorAll(`input[type='radio']`);

      return [...groupRadios].some((radio) => {
        if (radio.checked) {
          return radio.value === imageType;
        }
        return false;
      });
    });
  }
}

var firstLevelType = new LevelFirstTypeScreen();

class LevelSecondTypeScreen {
  init(gameView) {
    const gameModel = gameView.model;
    this.currentLevel = gameModel.currentLevel;

    this.answerHandler = (evt) => {
      evt.preventDefault();

      const answer = this.getAnswer(evt.currentTarget);
      gameView.showNextScreen(answer);
    };

    return this;
  }

  getAnswer(radio) {
    const imageType = this.currentLevel.image.type;
    return radio.value === imageType;
  }
}

var secondLevelType = new LevelSecondTypeScreen();

class LevelThirdTypeScreen {
  init(gameView) {
    const gameModel = gameView.model;
    this.currentLevel = gameModel.currentLevel;

    this.answerHandler = (evt) => {
      evt.preventDefault();

      const answer = this.getAnswer(evt.currentTarget);
      gameView.showNextScreen(answer);
    };

    return this;
  }

  getAnswer(target) {
    const imageSrc = target.querySelector(`img`).src;
    const selectedImage = this.currentLevel.images.find((image) => {
      return image.url === imageSrc;
    });
    return selectedImage.type === this.currentLevel.answer;
  }
}

var thirdLevelType = new LevelThirdTypeScreen();

class GameScreen {
  constructor(gameData, imagesBuffer) {
    this.model = new GameModel(gameData, imagesBuffer);
  }

  init(state) {
    this.model.updateState(state);
    this.view = new GameView(this.model);
    const time = new Date();

    this.view.showNextScreen = (answer) => {
      window.clearTimeout(this.view.model.state.timerId);

      if (!answer) {
        --state.lives;
      }
      this.model.addAnswer(answer, time);

      ++state.level;
      if (this.model.isCanPlay()) {
        Application.showGameScreen(state);
        return;
      }
      Application.showStatsScreen(state);
    };

    this.view.player = player.init(this.view);
    this.view.firstLevelType = firstLevelType.init(this.view);
    this.view.secondLevelType = secondLevelType.init(this.view);
    this.view.thirdLevelType = thirdLevelType.init(this.view);

    Utils.displayScreen(this.view.element);
  }
}

const getCurrentResult = (state) => {
  const currentResult = {
    amountCorrectAnswers: 0,
    amountFastAnswers: 0,
    amountSlowAnswers: 0,
    amountLivesLeft: state.lives
  };

  const countTotalPoints = ((sum, item) => {
    switch (item) {
      case `correct`:
        ++currentResult.amountCorrectAnswers;
        sum += 100;
        break;
      case `fast`:
        ++currentResult.amountCorrectAnswers;
        ++currentResult.amountFastAnswers;
        sum += 150;
        break;
      case `slow`:
        ++currentResult.amountCorrectAnswers;
        ++currentResult.amountSlowAnswers;
        sum += 50;
        break;
    }
    return sum;
  });

  let totalPoints = state.answers.reduce(countTotalPoints, 0) +
      currentResult.amountLivesLeft * 50;

  return {
    totalPoints,

    correctAnswers: {
      pointsPerUnit: amountPoints.CORRECT_ANSWER,
      amount: currentResult.amountCorrectAnswers,
      points: Utils.countOfPoints(currentResult.amountCorrectAnswers, amountPoints.CORRECT_ANSWER)
    },

    bonusesAndPenalties: [
      {
        title: `Бонус за скорость`,
        type: `fast`,
        pointsPerUnit: amountPoints.BONUS_FOR_FAST_ANSWER,
        amount: currentResult.amountFastAnswers,
        points: Utils.countOfPoints(currentResult.amountFastAnswers, amountPoints.BONUS_FOR_FAST_ANSWER)
      },
      {
        title: `Бонус за жизни`,
        type: `alive`,
        pointsPerUnit: amountPoints.BONUS_FOR_LIVES_LEFT,
        amount: currentResult.amountLivesLeft,
        points: Utils.countOfPoints(currentResult.amountLivesLeft, amountPoints.BONUS_FOR_LIVES_LEFT)
      },
      {
        title: `Штраф за медлительность`,
        type: `slow`,
        pointsPerUnit: -amountPoints.BONUS_FOR_SLOW_ANSWER,
        amount: currentResult.amountSlowAnswers,
        points: Utils.countOfPoints(currentResult.amountSlowAnswers, amountPoints.BONUS_FOR_SLOW_ANSWER)
      }
    ]
  };
};

class ResultView extends AbstractView {
  constructor(data) {
    super();
    this.data = data.reverse();
  }

  get template() {
    return (
      `<header class="header"></header>
      <div class="result">
        ${this.templateHeader(this.data[0])}
        ${this.data.map((item, index) => this.templateResultTable(item, index + 1)).join(` `)}
      </div>`
    );
  }

  isWin(state) {
    return (
      state.answers.length === GameParameters.NUMBER_ANSWERS &&
      state.lives >= GameParameters.MIN_COUNT_LIVES
    );
  }

  templateHeader(state) {
    if (this.isWin(state)) {
      return `<h1>Победа!</h1>`;
    }
    return `<h1>Поражение!</h1>`;
  }

  templateResultTable(state, index) {
    if (!this.isWin(state)) {
      return (
        `<table class="result__table">
          <tr>
            <td class="result__number">${index}.</td>
            <td>
              ${Utils.getStats(state.answers)}
            </td>
            <td class="result__total"></td>
            <td class="result__total  result__total--final">fail</td>
          </tr>
        </table>`
      );
    }

    const currentResult = getCurrentResult(state);

    const rows = currentResult.bonusesAndPenalties.map((item) => this.getTemplateResultRow(item));

    return (
      `<table class="result__table">
        <tr>
          <td class="result__number">${index}.</td>
          <td colspan="2">
            ${Utils.getStats(state.answers)}
          </td>
          <td class="result__points">×&nbsp;${currentResult.correctAnswers.pointsPerUnit}</td>
          <td class="result__total">${currentResult.correctAnswers.points}</td>
        </tr>
        ${rows.join(` `)}
        <tr>
          <td colspan="5" class="result__total  result__total--final">${currentResult.totalPoints}</td>
        </tr>
      </table>`
    );
  }

  getTemplateResultRow(item) {
    if (!item.amount) {
      return ``;
    }
    return (
      `<tr>
        <td></td>
        <td class="result__extra">${item.title}:</td>
        <td class="result__extra">${item.amount}&nbsp;<span class="stats__result stats__result--${item.type}"></span></td>
        <td class="result__points">×&nbsp;${item.pointsPerUnit}</td>
        <td class="result__total">${item.points}</td>
      </tr>`
    );
  }

  bind(element) {
    this.header = element.querySelector(`.header`);
    displayHeader(this);
  }
}

class ResultScreen {
  init(state) {
    const view = new ResultView(state);
    view.player = player.init();

    Utils.displayScreen(view.element);
  }
}

var resultScreen = new ResultScreen();

const TypeOfLevels$1 = {
  FIRST: `two-of-two`,
  SECOND: `tinder-like`,
  THIRD: `one-of-three`
};

const getParametersOfImages = (level) => {
  return level.answers.map((item) => {
    if (item.type === `painting`) {
      item.type = `paint`;
    }
    return {
      url: item.image.url,
      type: item.type
    };
  });
};

const adaptFirstLevelType = (level) => {
  return {
    question: level.question,
    type: `first`,
    images: getParametersOfImages(level, `third`)
  };
};

const adaptSecondLevelType = (level) => {
  return {
    question: level.question,
    type: `second`,
    image: getParametersOfImages(level)[0]
  };
};

const adaptThirdLevelType = (level) => {
  let amountPaint = 0;

  const images = level.answers.map((item) => {
    if (item.type === `painting`) {
      item.type = `paint`;
      ++amountPaint;
    }
    return {
      url: item.image.url,
      width: item.image.width,
      height: item.image.height,
      type: item.type
    };
  });

  let answer = `paint`;
  if (amountPaint === 2) {
    answer = `photo`;
  }
  return {
    question: level.question,
    answer,
    type: `third`,
    images
  };
};

const AdaptTypeOfLevels = {
  [TypeOfLevels$1.FIRST]: adaptFirstLevelType,
  [TypeOfLevels$1.SECOND]: adaptSecondLevelType,
  [TypeOfLevels$1.THIRD]: adaptThirdLevelType
};

const adapt = (data) => {
  return data.map((item) => {
    return AdaptTypeOfLevels[item.type](item);
  });
};

const loadImage = (url) => {
  return new Promise((onLoad, onError) => {
    const image = new Image();
    image.onload = () => onLoad(image);
    image.onerror = () => onError;
    image.src = url;
  });
};

const SERVER_URL = `https://es.dump.academy/pixel-hunter`;
const DEFAULT_NAME = `kvezal`;

class Loader {
  static loadData() {
    return fetch(`${SERVER_URL}/questions`).
        then((response) => {
          if (response.ok) {
            return response.json();
          }
          throw new Error(`Не удалось загрузить данные с сервера`);
        })
        .then(adapt);
  }

  static saveResult(data, name = DEFAULT_NAME) {
    const requestSettings = {
      body: JSON.stringify(data),
      headers: {
        'Content-Type': `application/json`
      },
      method: `POST`
    };

    return fetch(`${SERVER_URL}/stats/${name}`, requestSettings);
  }

  static loadResult(name = DEFAULT_NAME) {
    return fetch(`${SERVER_URL}/stats/${name}`).
        then((response) => {
          if (response.ok) {
            return response.json();
          }
          throw new Error(`Не удалось загрузить данные с сервера`);
        });
  }

  static loadFile(data) {
    const ListOfURLImages = new Set();

    data.forEach((item) => {
      if (item.type === `second`) {
        ListOfURLImages.add(item.image.url);
        return;
      }

      item.images.forEach((image) => {
        ListOfURLImages.add(image.url);
      });
    });

    return Promise.all([...ListOfURLImages].map((item) => loadImage(item)));
  }
}

class ErrorScreen extends AbstractView {
  constructor(message) {
    super();

    this.message = message;
  }

  get template() {
    return (
      `<div class="error-message">${this.message}</div>`
    );
  }

  static show(message) {
    const error = new ErrorScreen(message);
    Utils.displayElement(error.element, document.body, true);
  }
}

class SplashScreen extends AbstractView {
  constructor() {
    super();
  }

  get template() {
    return (
      `<svg xmlns="http://www.w3.org/2000/svg" class="splash" viewBox="0 0 780 780">
          <circle
            cx="390" cy="390" r="60"
            class="splash-line"
            style="transform: rotate(-90deg); transform-origin: center"></circle>
        </svg>`
    );
  }

  start() {
    Utils.displayScreen(this.element);
  }
}

var splash = new SplashScreen();

const ContrallerId = {
  GREETING: ``,
  RULES: `rules`,
  GAME: `game`,
  STATS: `stats`
};

class Application {
  static init(images) {
    Application.routes = {
      [ContrallerId.GREETING]: greetingScreen,
      [ContrallerId.RULES]: rulesScreen,
      [ContrallerId.GAME]: new GameScreen(quest, images),
      [ContrallerId.RESULT]: resultScreen
    };
    Application.showGreetingScreen();
  }

  static showGreetingScreen() {
    this.routes[ContrallerId.GREETING].init();
  }

  static showRulesScreen() {
    this.routes[ContrallerId.RULES].init();
  }

  static showGameScreen(state) {
    this.routes[ContrallerId.GAME].init(state);
  }

  static showStatsScreen(state) {
    splash.start();
    Loader.saveResult(state, state.name).
        then(() => Loader.loadResult(state.name)).
        then(this.routes[ContrallerId.RESULT].init);
  }
}

let quest = {};

const loadFile = (data) => {
  quest = data;
  return Loader.loadFile(data);
};

Loader.loadData()
    .then(loadFile)
    .then(Application.init)
    .catch(ErrorScreen.show);

}());

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZXMiOlsianMvZGF0YS9kYXRhLmpzIiwianMvbGliL3V0aWxzLmpzIiwianMvdmlld3MvYWJzdHJhY3Qtdmlldy5qcyIsImpzL3ZpZXdzL2dyZWV0aW5nLXZpZXcuanMiLCJqcy9zY3JlZW5zL2dyZWV0aW5nLXNjcmVlbi5qcyIsImpzL3ZpZXdzL2xldmVsLWZpcnN0LXR5cGUtdmlldy5qcyIsImpzL3ZpZXdzL2xldmVsLXNlY29uZC10eXBlLXZpZXcuanMiLCJqcy92aWV3cy9sZXZlbC10aGlyZC10eXBlLXZpZXcuanMiLCJqcy92aWV3cy9nYW1lLXZpZXcuanMiLCJqcy92aWV3cy9wbGF5ZXItdmlldy5qcyIsImpzL2xpYi9kaXNwbGF5LWhlYWRlci5qcyIsImpzL3ZpZXdzL3J1bGVzLXZpZXcuanMiLCJqcy9zY3JlZW5zL3BsYXllci1zY3JlZW4uanMiLCJqcy9zY3JlZW5zL3J1bGVzLXNjcmVlbi5qcyIsImpzL21vZGVscy9nYW1lLW1vZGVsLmpzIiwianMvc2NyZWVucy9sZXZlbC1maXJzdC10eXBlLXNjcmVlbi5qcyIsImpzL3NjcmVlbnMvbGV2ZWwtc2Vjb25kLXR5cGUtc2NyZWVuLmpzIiwianMvc2NyZWVucy9sZXZlbC10aGlyZC10eXBlLXNjcmVlbi5qcyIsImpzL3NjcmVlbnMvZ2FtZS1zY3JlZW4uanMiLCJqcy9saWIvZ2V0LWN1cnJlbnQtcmVzdWx0LmpzIiwianMvdmlld3MvcmVzdWx0LXZlaXcuanMiLCJqcy9zY3JlZW5zL3Jlc3VsdC1zY3JlZW4uanMiLCJqcy9kYXRhL2RhdGEtYWRhcHRlci5qcyIsImpzL2xpYi9sb2FkLWltYWdlLmpzIiwianMvbG9hZGVyLmpzIiwianMvc2NyZWVucy9lcnJvci1zY3JlZW4uanMiLCJqcy9zY3JlZW5zL3NwbGFzaC1zY3JlZW4uanMiLCJqcy9hcHBsaWNhdGlvbi5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJjb25zdCBpbml0aWFsU3RhdGUgPSB7XG4gIGxpdmVzOiAzLFxuICB0aW1lOiAzMCxcbiAgbGV2ZWw6IDBcbn07XG5cbmNvbnN0IEdhbWVQYXJhbWV0ZXJzID0ge1xuICBNSU5fQ09VTlRfTElWRVM6IDAsXG4gIE1JTl9DT1VOVF9USU1FOiAwLFxuICBOVU1CRVJfQU5TV0VSUzogMTAsXG4gIEFNT1VOVF9NSUxJU0VDT05EU19JTl9TRUNPTkRTOiAxMDAwXG59O1xuXG5jb25zdCBhbW91bnRQb2ludHMgPSB7XG4gIENPUlJFQ1RfQU5TV0VSOiAxMDAsXG4gIEJPTlVTX0ZPUl9GQVNUX0FOU1dFUjogNTAsXG4gIEJPTlVTX0ZPUl9TTE9XX0FOU1dFUjogLTUwLFxuICBCT05VU19GT1JfTElWRVNfTEVGVDogNTBcbn07XG5cbmV4cG9ydCB7R2FtZVBhcmFtZXRlcnMsIGluaXRpYWxTdGF0ZSwgYW1vdW50UG9pbnRzfTtcbiIsImltcG9ydCB7R2FtZVBhcmFtZXRlcnN9IGZyb20gJy4uL2RhdGEvZGF0YSc7XG5cbmNvbnN0IG1haW4gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGAuY2VudHJhbGApO1xuXG5jbGFzcyBVdGlscyB7XG4gIHN0YXRpYyBnZXRFbGVtZW50RnJvbVRlbXBsYXRlKG11cmt1cCkge1xuICAgIGNvbnN0IHRlbXBsYXRlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChgdGVtcGxhdGVgKTtcbiAgICB0ZW1wbGF0ZS5pbm5lckhUTUwgPSBtdXJrdXA7XG4gICAgcmV0dXJuIHRlbXBsYXRlLmNvbnRlbnQ7XG4gIH1cblxuICBzdGF0aWMgY2xlYXJFbGVtZW50KHBhcmVudCkge1xuICAgIHdoaWxlIChwYXJlbnQuZmlyc3RDaGlsZCkge1xuICAgICAgcGFyZW50LnJlbW92ZUNoaWxkKHBhcmVudC5maXJzdENoaWxkKTtcbiAgICB9XG4gIH1cblxuICBzdGF0aWMgZGlzcGxheUVsZW1lbnQobmV3RWxlbWVudCwgcGFyZW50LCBjbGVhciA9IGZhbHNlKSB7XG4gICAgaWYgKGNsZWFyKSB7XG4gICAgICB0aGlzLmNsZWFyRWxlbWVudChwYXJlbnQpO1xuICAgIH1cbiAgICBpZiAocGFyZW50LmZpcnN0RWxlbWVudENoaWxkKSB7XG4gICAgICBwYXJlbnQuaW5zZXJ0QmVmb3JlKG5ld0VsZW1lbnQsIHBhcmVudC5maXJzdEVsZW1lbnRDaGlsZCk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIHBhcmVudC5hcHBlbmRDaGlsZChuZXdFbGVtZW50KTtcbiAgfVxuXG4gIHN0YXRpYyBkaXNwbGF5U2NyZWVuKG5ld0VsZW1lbnQpIHtcbiAgICB0aGlzLmRpc3BsYXlFbGVtZW50KG5ld0VsZW1lbnQsIG1haW4sIHRydWUpO1xuICB9XG5cbiAgc3RhdGljIGdldExldmVsKGxldmVsLCBkYXRhKSB7XG4gICAgcmV0dXJuIGRhdGFbbGV2ZWxdO1xuICB9XG5cbiAgc3RhdGljIGdldFN0YXRzKGxpc3RBbnN3ZXJzKSB7XG4gICAgY29uc3Qgc3RhdHMgPSBbYDx1bCBjbGFzcz1cInN0YXRzXCI+YF07XG4gICAgbGlzdEFuc3dlcnMuZm9yRWFjaCgoaXRlbSkgPT4ge1xuICAgICAgc3RhdHMucHVzaChgPGxpIGNsYXNzPVwic3RhdHNfX3Jlc3VsdCBzdGF0c19fcmVzdWx0LS0ke2l0ZW19XCI+PC9saT5gKTtcbiAgICB9KTtcblxuICAgIGNvbnN0IGFtb3VudFVua25vd25BbnN3ZXJzID0gR2FtZVBhcmFtZXRlcnMuTlVNQkVSX0FOU1dFUlMgLSBsaXN0QW5zd2Vycy5sZW5ndGg7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBhbW91bnRVbmtub3duQW5zd2VyczsgaSsrKSB7XG4gICAgICBzdGF0cy5wdXNoKGA8bGkgY2xhc3M9XCJzdGF0c19fcmVzdWx0IHN0YXRzX19yZXN1bHQtLXVua25vd25cIj48L2xpPmApO1xuICAgIH1cbiAgICBzdGF0cy5wdXNoKGA8L3VsPmApO1xuICAgIHJldHVybiBzdGF0cy5qb2luKGAgYCk7XG4gIH1cblxuICBzdGF0aWMgY291bnRPZlBvaW50cyhhbW91bnQsIHBvaW50cykge1xuICAgIHJldHVybiBhbW91bnQgKiBwb2ludHM7XG4gIH1cblxuICBzdGF0aWMgcmVzaXplKGltYWdlLCBkZWZhdWx0UGFyYW1ldGVycykge1xuICAgIGNvbnN0IHJhdGlvSW1hZ2UgPSBpbWFnZS53aWR0aCAvIGltYWdlLmhlaWdodDtcblxuICAgIGxldCBuZXdXaWR0aCA9IGRlZmF1bHRQYXJhbWV0ZXJzLldJRFRIO1xuICAgIGxldCBuZXdIZWlnaHQgPSBuZXdXaWR0aCAvIHJhdGlvSW1hZ2U7XG4gICAgaWYgKG5ld0hlaWdodCA8PSBkZWZhdWx0UGFyYW1ldGVycy5IRUlHSFQpIHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIHdpZHRoOiBuZXdXaWR0aCxcbiAgICAgICAgaGVpZ2h0OiBuZXdIZWlnaHRcbiAgICAgIH07XG4gICAgfVxuXG4gICAgbmV3SGVpZ2h0ID0gZGVmYXVsdFBhcmFtZXRlcnMuSEVJR0hUO1xuICAgIG5ld1dpZHRoID0gbmV3SGVpZ2h0ICogcmF0aW9JbWFnZTtcbiAgICByZXR1cm4ge1xuICAgICAgd2lkdGg6IG5ld1dpZHRoLFxuICAgICAgaGVpZ2h0OiBuZXdIZWlnaHRcbiAgICB9O1xuICB9XG5cbiAgc3RhdGljIGdldEltYWdlUGFyYW1ldGVycyhidWZmZXIsIHVybCkge1xuICAgIGNvbnN0IGltYWdlQnVmZmVyID0gYnVmZmVyLmZpbmQoKGltYWdlKSA9PiBpbWFnZS5zcmMgPT09IHVybCk7XG4gICAgcmV0dXJuIHtcbiAgICAgIHdpZHRoOiBpbWFnZUJ1ZmZlci53aWR0aCxcbiAgICAgIGhlaWdodDogaW1hZ2VCdWZmZXIuaGVpZ2h0XG4gICAgfTtcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBVdGlscztcbiIsImltcG9ydCBVdGlscyBmcm9tICcuLi9saWIvdXRpbHMnO1xuXG5jbGFzcyBBYnN0cmFjdFZpZXcge1xuICBnZXQgdGVtcGxhdGUoKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKGBZb3UgaGF2ZSB0byBkZWZpbmUgdGVtcGxhdGUgZm9yIHZpZXchYCk7XG4gIH1cblxuICBnZXQgZWxlbWVudCgpIHtcbiAgICBpZiAoIXRoaXMuX2VsZW1lbnQpIHtcbiAgICAgIHRoaXMuX2VsZW1lbnQgPSB0aGlzLnJlbmRlcigpO1xuICAgIH1cbiAgICBjb25zdCBlbGVtZW50ID0gdGhpcy5fZWxlbWVudC5jbG9uZU5vZGUodHJ1ZSk7XG4gICAgdGhpcy5iaW5kKGVsZW1lbnQpO1xuICAgIHJldHVybiBlbGVtZW50O1xuICB9XG5cbiAgYmluZCgpIHtcblxuICB9XG5cbiAgcmVuZGVyKCkge1xuICAgIHJldHVybiBVdGlscy5nZXRFbGVtZW50RnJvbVRlbXBsYXRlKHRoaXMudGVtcGxhdGUpO1xuICB9XG5cbn1cblxuZXhwb3J0IGRlZmF1bHQgQWJzdHJhY3RWaWV3O1xuIiwiaW1wb3J0IEFic3RyYWN0VmlldyBmcm9tICcuL2Fic3RyYWN0LXZpZXcnO1xuXG5jbGFzcyBHcmVldGluZ1ZpZXcgZXh0ZW5kcyBBYnN0cmFjdFZpZXcge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBzdXBlcigpO1xuICB9XG5cbiAgZ2V0IHRlbXBsYXRlKCkge1xuICAgIHJldHVybiAoXG4gICAgICBgPGRpdiBjbGFzcz1cImdyZWV0aW5nXCI+XG4gICAgICAgIDxkaXYgY2xhc3M9XCJncmVldGluZ19fbG9nb1wiPjxpbWcgc3JjPVwiaW1nL2xvZ29fYmlnLnBuZ1wiIHdpZHRoPVwiMjAxXCIgaGVpZ2h0PVwiODlcIiBhbHQ9XCJQaXhlbCBIdW50ZXJcIj48L2Rpdj5cbiAgICAgICAgPGgxIGNsYXNzPVwiZ3JlZXRpbmdfX2FzdGVyaXNrXCI+KjwvaDE+XG4gICAgICAgIDxkaXYgY2xhc3M9XCJncmVldGluZ19fY2hhbGxlbmdlXCI+XG4gICAgICAgICAgPGgzPtCb0YPRh9GI0LjQtSDRhdGD0LTQvtC20L3QuNC60Lgt0YTQvtGC0L7RgNC10LDQu9C40YHRgtGLINCx0YDQvtGB0LDRjtGCJm5ic3A70YLQtdCx0LUmbmJzcDvQstGL0LfQvtCyITwvaDM+XG4gICAgICAgICAgPHA+0J/RgNCw0LLQuNC70LAg0LjQs9GA0Ysg0L/RgNC+0YHRgtGLLjxicj5cbiAgICAgICAgICAgINCd0YPQttC90L4g0L7RgtC70LjRh9C40YLRjCDRgNC40YHRg9C90L7QuiZuYnNwO9C+0YIg0YTQvtGC0L7Qs9GA0LDRhNC40Lgg0Lgg0YHQtNC10LvQsNGC0Ywg0LLRi9Cx0L7RgC48YnI+XG4gICAgICAgICAgICDQl9Cw0LTQsNGH0LAg0LrQsNC20LXRgtGB0Y8g0YLRgNC40LLQuNCw0LvRjNC90L7QuSwg0L3QviDQvdC1INC00YPQvNCw0LksINGH0YLQviDQstGB0LUg0YLQsNC6INC/0YDQvtGB0YLQvi48YnI+XG4gICAgICAgICAgICDQpNC+0YLQvtGA0LXQsNC70LjQt9C8INC+0LHQvNCw0L3Rh9C40LIg0Lgg0LrQvtCy0LDRgNC10L0uPGJyPlxuICAgICAgICAgICAg0J/QvtC80L3QuCwg0LPQu9Cw0LLQvdC+0LUg4oCUINGB0LzQvtGC0YDQtdGC0Ywg0L7Rh9C10L3RjCDQstC90LjQvNCw0YLQtdC70YzQvdC+LjwvcD5cbiAgICAgICAgPC9kaXY+XG4gICAgICAgIDxkaXYgY2xhc3M9XCJncmVldGluZ19fY29udGludWVcIj48c3Bhbj48aW1nIHNyYz1cImltZy9hcnJvd19yaWdodC5zdmdcIiB3aWR0aD1cIjY0XCIgaGVpZ2h0PVwiNjRcIiBhbHQ9XCJOZXh0XCI+PC9zcGFuPjwvZGl2PlxuICAgICAgPC9kaXY+YFxuICAgICk7XG4gIH1cblxuICBiaW5kKGVsZW1lbnQpIHtcbiAgICBjb25zdCBidXR0b25Db250aW51ZSA9IGVsZW1lbnQucXVlcnlTZWxlY3RvcihgLmdyZWV0aW5nX19jb250aW51ZWApO1xuICAgIGJ1dHRvbkNvbnRpbnVlLm9uY2xpY2sgPSAoZXZ0KSA9PiB0aGlzLmNvbnRpbnVlSGFuZGxlcihldnQpO1xuXG4gICAgY29uc3QgZ3JlZXRpbmcgPSBlbGVtZW50LnF1ZXJ5U2VsZWN0b3IoYC5ncmVldGluZ2ApO1xuICAgIHdpbmRvdy5zZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgIGdyZWV0aW5nLmNsYXNzTGlzdC5hZGQoYGNlbnRyYWwtLWJsdXJgKTtcbiAgICB9LCAxMCk7XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgR3JlZXRpbmdWaWV3O1xuIiwiaW1wb3J0IEFwcCBmcm9tICcuLi9hcHBsaWNhdGlvbic7XG5pbXBvcnQgR3JlZXRpbmdWaWV3IGZyb20gJy4uL3ZpZXdzL2dyZWV0aW5nLXZpZXcnO1xuaW1wb3J0IFV0aWxzIGZyb20gJy4uL2xpYi91dGlscyc7XG5cbmNsYXNzIEdyZWV0aW5nU2NyZWVuIHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy52aWV3ID0gbmV3IEdyZWV0aW5nVmlldygpO1xuICB9XG5cbiAgaW5pdCgpIHtcbiAgICB0aGlzLnZpZXcuY29udGludWVIYW5kbGVyID0gKCkgPT4ge1xuICAgICAgQXBwLnNob3dSdWxlc1NjcmVlbigpO1xuICAgIH07XG5cbiAgICBVdGlscy5kaXNwbGF5U2NyZWVuKHRoaXMudmlldy5lbGVtZW50KTtcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBuZXcgR3JlZXRpbmdTY3JlZW4oKTtcbiIsImltcG9ydCBBYnN0cmFjdFZpZXcgZnJvbSAnLi9hYnN0cmFjdC12aWV3JztcbmltcG9ydCBVdGlscyBmcm9tICcuLi9saWIvdXRpbHMnO1xuXG5jb25zdCBJTUFHRV9QQVJBTUVURVJTID0ge1xuICBXSURUSDogNDY4LFxuICBIRUlHSFQ6IDQ1OFxufTtcblxuY2xhc3MgTGV2ZWxGaXJzdFR5cGVWaWV3IGV4dGVuZHMgQWJzdHJhY3RWaWV3IHtcbiAgY29uc3RydWN0b3IoZ2FtZVZpZXcpIHtcbiAgICBzdXBlcigpO1xuXG4gICAgdGhpcy5hbnN3ZXJIYW5kbGVyID0gZ2FtZVZpZXcuZmlyc3RMZXZlbFR5cGUuYW5zd2VySGFuZGxlcjtcbiAgICB0aGlzLmltYWdlc0J1ZmZlciA9IGdhbWVWaWV3Lm1vZGVsLmltYWdlc0J1ZmZlcjtcbiAgICB0aGlzLmN1cnJlbnRMZXZlbCA9IGdhbWVWaWV3Lm1vZGVsLmRhdGFbZ2FtZVZpZXcubW9kZWwuc3RhdGUubGV2ZWxdO1xuICB9XG5cbiAgZ2V0IHRlbXBsYXRlKCkge1xuICAgIHJldHVybiAoXG4gICAgICBgPHAgY2xhc3M9XCJnYW1lX190YXNrXCI+JHt0aGlzLmN1cnJlbnRMZXZlbC5xdWVzdGlvbn08L3A+XG4gICAgICA8Zm9ybSBjbGFzcz1cImdhbWVfX2NvbnRlbnRcIj5cbiAgICAgICAgJHt0aGlzLnRlbXBsYXRlR2FtZU9wdGlvbnN9XG4gICAgICA8L2Zvcm0+YFxuICAgICk7XG4gIH1cblxuICB0ZW1wbGF0ZU9wdGlvbih1cmwsIGluZGV4KSB7XG4gICAgY29uc3QgaW1hZ2VQYXJhbWV0ZXJzID0gVXRpbHMuZ2V0SW1hZ2VQYXJhbWV0ZXJzKHRoaXMuaW1hZ2VzQnVmZmVyLCB1cmwpO1xuICAgIGNvbnN0IG5ld0ltYWdlUGFyYW1ldGVycyA9IFV0aWxzLnJlc2l6ZShpbWFnZVBhcmFtZXRlcnMsIElNQUdFX1BBUkFNRVRFUlMpO1xuXG4gICAgcmV0dXJuIChcbiAgICAgIGA8ZGl2IGNsYXNzPVwiZ2FtZV9fb3B0aW9uXCI+XG4gICAgICAgIDxpbWcgc3JjPVwiJHt1cmx9XCIgYWx0PVwiT3B0aW9uICR7aW5kZXggKyAxfVwiIHdpZHRoPVwiJHtuZXdJbWFnZVBhcmFtZXRlcnMud2lkdGh9XCIgaGVpZ2h0PVwiJHtuZXdJbWFnZVBhcmFtZXRlcnMuaGVpZ2h0fVwiPlxuICAgICAgICA8bGFiZWwgY2xhc3M9XCJnYW1lX19hbnN3ZXIgZ2FtZV9fYW5zd2VyLS1waG90b1wiPlxuICAgICAgICAgIDxpbnB1dCBuYW1lPVwicXVlc3Rpb24ke2luZGV4ICsgMX1cIiB0eXBlPVwicmFkaW9cIiB2YWx1ZT1cInBob3RvXCI+XG4gICAgICAgICAgPHNwYW4+0KTQvtGC0L48L3NwYW4+XG4gICAgICAgIDwvbGFiZWw+XG4gICAgICAgIDxsYWJlbCBjbGFzcz1cImdhbWVfX2Fuc3dlciBnYW1lX19hbnN3ZXItLXBhaW50XCI+XG4gICAgICAgICAgPGlucHV0IG5hbWU9XCJxdWVzdGlvbiR7aW5kZXggKyAxfVwiIHR5cGU9XCJyYWRpb1wiIHZhbHVlPVwicGFpbnRcIj5cbiAgICAgICAgICA8c3Bhbj7QoNC40YHRg9C90L7Qujwvc3Bhbj5cbiAgICAgICAgPC9sYWJlbD5cbiAgICAgIDwvZGl2PmBcbiAgICApO1xuICB9XG5cbiAgZ2V0IHRlbXBsYXRlR2FtZU9wdGlvbnMoKSB7XG4gICAgcmV0dXJuIHRoaXMuY3VycmVudExldmVsLmltYWdlcy5tYXAoKGl0ZW0sIGluZGV4KSA9PiB7XG4gICAgICByZXR1cm4gdGhpcy50ZW1wbGF0ZU9wdGlvbihpdGVtLnVybCwgaW5kZXgpO1xuICAgIH0pLmpvaW4oYCBgKTtcbiAgfVxuXG4gIGJpbmQoZWxlbWVudCkge1xuICAgIGNvbnN0IGZvcm0gPSBlbGVtZW50LnF1ZXJ5U2VsZWN0b3IoYC5nYW1lX19jb250ZW50YCk7XG5cbiAgICBjb25zdCByYWRpb0J1dHRvbnMgPSBmb3JtLnF1ZXJ5U2VsZWN0b3JBbGwoYGlucHV0W3R5cGU9J3JhZGlvJ11gKTtcbiAgICBbLi4ucmFkaW9CdXR0b25zXS5mb3JFYWNoKChyYWRpbykgPT4ge1xuICAgICAgcmFkaW8ub25jaGFuZ2UgPSAoZXZ0KSA9PiB0aGlzLmFuc3dlckhhbmRsZXIoZXZ0LCBmb3JtKTtcbiAgICB9KTtcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBMZXZlbEZpcnN0VHlwZVZpZXc7XG4iLCJpbXBvcnQgQWJzdHJhY3RWaWV3IGZyb20gJy4vYWJzdHJhY3Qtdmlldyc7XG5pbXBvcnQgVXRpbHMgZnJvbSAnLi4vbGliL3V0aWxzJztcblxuY29uc3QgSU1BR0VfUEFSQU1FVEVSUyA9IHtcbiAgV0lEVEg6IDcwNSxcbiAgSEVJR0hUOiA0NTVcbn07XG5cbmNsYXNzIExldmVsU2Vjb25kVHlwZVZpZXcgZXh0ZW5kcyBBYnN0cmFjdFZpZXcge1xuICBjb25zdHJ1Y3RvcihnYW1lVmlldykge1xuICAgIHN1cGVyKCk7XG5cbiAgICB0aGlzLmFuc3dlckhhbmRsZXIgPSBnYW1lVmlldy5zZWNvbmRMZXZlbFR5cGUuYW5zd2VySGFuZGxlcjtcbiAgICB0aGlzLmltYWdlc0J1ZmZlciA9IGdhbWVWaWV3Lm1vZGVsLmltYWdlc0J1ZmZlcjtcbiAgICB0aGlzLmN1cnJlbnRMZXZlbCA9IGdhbWVWaWV3Lm1vZGVsLmRhdGFbZ2FtZVZpZXcubW9kZWwuc3RhdGUubGV2ZWxdO1xuICB9XG5cbiAgZ2V0IHRlbXBsYXRlKCkge1xuICAgIGNvbnN0IGltYWdlUGFyYW1ldGVycyA9IFV0aWxzLmdldEltYWdlUGFyYW1ldGVycyh0aGlzLmltYWdlc0J1ZmZlcixcbiAgICAgICAgdGhpcy5jdXJyZW50TGV2ZWwuaW1hZ2UudXJsKTtcbiAgICBjb25zdCBuZXdJbWFnZVBhcmFtZXRlcnMgPSBVdGlscy5yZXNpemUoaW1hZ2VQYXJhbWV0ZXJzLCBJTUFHRV9QQVJBTUVURVJTKTtcblxuICAgIHJldHVybiAoXG4gICAgICBgPHAgY2xhc3M9XCJnYW1lX190YXNrXCI+0KPQs9Cw0LTQsNC5LCDRhNC+0YLQviDQuNC70Lgg0YDQuNGB0YPQvdC+0Lo/PC9wPlxuICAgICAgPGZvcm0gY2xhc3M9XCJnYW1lX19jb250ZW50ICBnYW1lX19jb250ZW50LS13aWRlXCI+XG4gICAgICAgIDxkaXYgY2xhc3M9XCJnYW1lX19vcHRpb25cIj5cbiAgICAgICAgICA8aW1nIHNyYz1cIiR7dGhpcy5jdXJyZW50TGV2ZWwuaW1hZ2UudXJsfVwiIGFsdD1cIk9wdGlvbiAxXCIgd2lkdGg9XCIke25ld0ltYWdlUGFyYW1ldGVycy53aWR0aH1cIiBoZWlnaHQ9XCIke25ld0ltYWdlUGFyYW1ldGVycy5oZWlnaHR9XCI+XG4gICAgICAgICAgPGxhYmVsIGNsYXNzPVwiZ2FtZV9fYW5zd2VyICBnYW1lX19hbnN3ZXItLXBob3RvXCI+XG4gICAgICAgICAgICA8aW5wdXQgbmFtZT1cInF1ZXN0aW9uMVwiIHR5cGU9XCJyYWRpb1wiIHZhbHVlPVwicGhvdG9cIj5cbiAgICAgICAgICAgIDxzcGFuPtCk0L7RgtC+PC9zcGFuPlxuICAgICAgICAgIDwvbGFiZWw+XG4gICAgICAgICAgPGxhYmVsIGNsYXNzPVwiZ2FtZV9fYW5zd2VyICBnYW1lX19hbnN3ZXItLXdpZGUgIGdhbWVfX2Fuc3dlci0tcGFpbnRcIj5cbiAgICAgICAgICAgIDxpbnB1dCBuYW1lPVwicXVlc3Rpb24xXCIgdHlwZT1cInJhZGlvXCIgdmFsdWU9XCJwYWludFwiPlxuICAgICAgICAgICAgPHNwYW4+0KDQuNGB0YPQvdC+0Lo8L3NwYW4+XG4gICAgICAgICAgPC9sYWJlbD5cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L2Zvcm0+YFxuICAgICk7XG4gIH1cblxuICBiaW5kKGVsZW1lbnQpIHtcbiAgICBjb25zdCByYWRpb0J1dHRvbnMgPSBlbGVtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoYGlucHV0W3R5cGU9J3JhZGlvJ11gKTtcbiAgICBbLi4ucmFkaW9CdXR0b25zXS5mb3JFYWNoKChyYWRpbykgPT4ge1xuICAgICAgcmFkaW8ub25jbGljayA9IChldnQpID0+IHRoaXMuYW5zd2VySGFuZGxlcihldnQsIFsuLi5yYWRpb0J1dHRvbnNdKTtcbiAgICB9KTtcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBMZXZlbFNlY29uZFR5cGVWaWV3O1xuIiwiaW1wb3J0IEFic3RyYWN0VmlldyBmcm9tICcuL2Fic3RyYWN0LXZpZXcnO1xuaW1wb3J0IFV0aWxzIGZyb20gJy4uL2xpYi91dGlscyc7XG5cbmNvbnN0IElNQUdFX1BBUkFNRVRFUlMgPSB7XG4gIFdJRFRIOiAzMDQsXG4gIEhFSUdIVDogNDU1XG59O1xuXG5jbGFzcyBMZXZlbFRoaXJkVHlwZVZpZXcgZXh0ZW5kcyBBYnN0cmFjdFZpZXcge1xuICBjb25zdHJ1Y3RvcihnYW1lVmlldykge1xuICAgIHN1cGVyKCk7XG5cbiAgICB0aGlzLmFuc3dlckhhbmRsZXIgPSBnYW1lVmlldy50aGlyZExldmVsVHlwZS5hbnN3ZXJIYW5kbGVyO1xuICAgIHRoaXMuaW1hZ2VzQnVmZmVyID0gZ2FtZVZpZXcubW9kZWwuaW1hZ2VzQnVmZmVyO1xuICAgIHRoaXMuY3VycmVudExldmVsID0gZ2FtZVZpZXcubW9kZWwuZGF0YVtnYW1lVmlldy5tb2RlbC5zdGF0ZS5sZXZlbF07XG4gIH1cblxuICBnZXQgdGVtcGxhdGUoKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIGA8cCBjbGFzcz1cImdhbWVfX3Rhc2tcIj4ke3RoaXMuY3VycmVudExldmVsLnF1ZXN0aW9ufTwvcD5cbiAgICAgIDxmb3JtIGNsYXNzPVwiZ2FtZV9fY29udGVudCAgZ2FtZV9fY29udGVudC0tdHJpcGxlXCI+XG4gICAgICAgICR7dGhpcy50ZW1wbGF0ZUdhbWVPcHRpb25zfVxuICAgICAgPC9mb3JtPmBcbiAgICApO1xuICB9XG5cbiAgdGVtcGxhdGVPcHRpb24odXJsLCBpbmRleCkge1xuICAgIGNvbnN0IGltYWdlUGFyYW1ldGVycyA9IFV0aWxzLmdldEltYWdlUGFyYW1ldGVycyh0aGlzLmltYWdlc0J1ZmZlciwgdXJsKTtcbiAgICBjb25zdCBuZXdJbWFnZVBhcmFtZXRlcnMgPSBVdGlscy5yZXNpemUoaW1hZ2VQYXJhbWV0ZXJzLCBJTUFHRV9QQVJBTUVURVJTKTtcblxuICAgIHJldHVybiAoXG4gICAgICBgPGRpdiBjbGFzcz1cImdhbWVfX29wdGlvblwiPlxuICAgICAgICA8aW1nIHNyYz1cIiR7dXJsfVwiIGFsdD1cIk9wdGlvbiAke2luZGV4ICsgMX1cIiB3aWR0aD1cIiR7bmV3SW1hZ2VQYXJhbWV0ZXJzLndpZHRofVwiIGhlaWdodD1cIiR7bmV3SW1hZ2VQYXJhbWV0ZXJzLmhlaWdodH1cIj5cbiAgICAgIDwvZGl2PmBcbiAgICApO1xuICB9XG5cbiAgZ2V0IHRlbXBsYXRlR2FtZU9wdGlvbnMoKSB7XG4gICAgcmV0dXJuIHRoaXMuY3VycmVudExldmVsLmltYWdlcy5tYXAoKGl0ZW0sIGluZGV4KSA9PiB7XG4gICAgICByZXR1cm4gdGhpcy50ZW1wbGF0ZU9wdGlvbihpdGVtLnVybCwgaW5kZXgpO1xuICAgIH0pLmpvaW4oYCBgKTtcbiAgfVxuXG4gIGJpbmQoZWxlbWVudCkge1xuICAgIGNvbnN0IG9wdGlvbnMgPSBlbGVtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoYC5nYW1lX19vcHRpb25gKTtcbiAgICBbLi4ub3B0aW9uc10uZm9yRWFjaCgob3B0aW9uKSA9PiB7XG4gICAgICBvcHRpb24ub25jbGljayA9IChldnQpID0+IHRoaXMuYW5zd2VySGFuZGxlcihldnQpO1xuICAgIH0pO1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IExldmVsVGhpcmRUeXBlVmlldztcbiIsImltcG9ydCBBYnN0cmFjdFZpZXcgZnJvbSAnLi9hYnN0cmFjdC12aWV3JztcbmltcG9ydCBMZXZlbEZpcnN0VHlwZVZpZXcgZnJvbSAnLi9sZXZlbC1maXJzdC10eXBlLXZpZXcnO1xuaW1wb3J0IExldmVsU2Vjb25kVHlwZVZpZXcgZnJvbSAnLi9sZXZlbC1zZWNvbmQtdHlwZS12aWV3JztcbmltcG9ydCBMZXZlbFRoaXJkVHlwZVZpZXcgZnJvbSAnLi9sZXZlbC10aGlyZC10eXBlLXZpZXcnO1xuaW1wb3J0IFV0aWxzIGZyb20gJy4uL2xpYi91dGlscyc7XG5pbXBvcnQgZGlzcGxheUhlYWRlciBmcm9tICcuLi9saWIvZGlzcGxheS1oZWFkZXInO1xuXG5jb25zdCBUeXBlT2ZMZXZlbHMgPSB7XG4gIEZJUlNUOiBgZmlyc3RgLFxuICBTRUNPTkQ6IGBzZWNvbmRgLFxuICBUSElSRDogYHRoaXJkYFxufTtcblxuY29uc3Qgcm91dGVzTGV2ZWwgPSB7XG4gIFtUeXBlT2ZMZXZlbHMuRklSU1RdOiBMZXZlbEZpcnN0VHlwZVZpZXcsXG4gIFtUeXBlT2ZMZXZlbHMuU0VDT05EXTogTGV2ZWxTZWNvbmRUeXBlVmlldyxcbiAgW1R5cGVPZkxldmVscy5USElSRF06IExldmVsVGhpcmRUeXBlVmlld1xufTtcblxuY2xhc3MgR2FtZVZpZXcgZXh0ZW5kcyBBYnN0cmFjdFZpZXcge1xuICBjb25zdHJ1Y3Rvcihtb2RlbCkge1xuICAgIHN1cGVyKCk7XG4gICAgdGhpcy5tb2RlbCA9IG1vZGVsO1xuICB9XG5cbiAgZ2V0IHRlbXBsYXRlKCkge1xuICAgIHJldHVybiAoXG4gICAgICBgPGhlYWRlciBjbGFzcz1cImhlYWRlclwiPjwvaGVhZGVyPlxuICAgICAgPGRpdiBjbGFzcz1cImdhbWVcIj5cbiAgICAgICAgPGRpdiBjbGFzcz1cInN0YXRzXCI+XG4gICAgICAgICAgJHtVdGlscy5nZXRTdGF0cyh0aGlzLm1vZGVsLnN0YXRlLmFuc3dlcnMpfVxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvZGl2PmBcbiAgICApO1xuICB9XG5cbiAgYmluZChlbGVtZW50KSB7XG4gICAgdGhpcy5oZWFkZXIgPSBlbGVtZW50LnF1ZXJ5U2VsZWN0b3IoYC5oZWFkZXJgKTtcbiAgICBkaXNwbGF5SGVhZGVyKHRoaXMpO1xuXG4gICAgdGhpcy5sZXZlbENvbnRhaW5lciA9IGVsZW1lbnQucXVlcnlTZWxlY3RvcihgLmdhbWVgKTtcbiAgICB0aGlzLnVwZGF0ZUxldmVsKCk7XG4gIH1cblxuICB1cGRhdGVMZXZlbCgpIHtcbiAgICBjb25zdCBjdXJyZW50VHlwZUxldmVsID0gdGhpcy5tb2RlbC5jdXJyZW50TGV2ZWwudHlwZTtcbiAgICBjb25zdCBsZXZlbCA9IG5ldyByb3V0ZXNMZXZlbFtjdXJyZW50VHlwZUxldmVsXSh0aGlzKS5lbGVtZW50O1xuICAgIFV0aWxzLmRpc3BsYXlFbGVtZW50KGxldmVsLCB0aGlzLmxldmVsQ29udGFpbmVyKTtcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBHYW1lVmlldztcbiIsImltcG9ydCBBYnN0cmFjdFZpZXcgZnJvbSAnLi9hYnN0cmFjdC12aWV3JztcbmltcG9ydCB7aW5pdGlhbFN0YXRlLCBHYW1lUGFyYW1ldGVyc30gZnJvbSAnLi4vZGF0YS9kYXRhJztcbmltcG9ydCBHYW1lVmlldyBmcm9tICcuL2dhbWUtdmlldyc7XG5cbmNsYXNzIFBsYXllclZpZXcgZXh0ZW5kcyBBYnN0cmFjdFZpZXcge1xuICBjb25zdHJ1Y3Rvcih2aWV3KSB7XG4gICAgc3VwZXIoKTtcblxuICAgIHRoaXMudmlldyA9IHZpZXc7XG4gICAgdGhpcy5idXR0b25CYWNrSGFuZGxlciA9IHZpZXcucGxheWVyLmJ1dHRvbkJhY2tIYW5kbGVyO1xuICB9XG5cbiAgZ2V0IHRlbXBsYXRlKCkge1xuICAgIHJldHVybiAoXG4gICAgICBgPGRpdiBjbGFzcz1cImhlYWRlcl9fYmFja1wiPlxuICAgICAgICA8YnV0dG9uIGNsYXNzPVwiYmFja1wiPlxuICAgICAgICAgIDxpbWcgc3JjPVwiaW1nL2Fycm93X2xlZnQuc3ZnXCIgd2lkdGg9XCI0NVwiIGhlaWdodD1cIjQ1XCIgYWx0PVwiQmFja1wiPlxuICAgICAgICAgIDxpbWcgc3JjPVwiaW1nL2xvZ29fc21hbGwuc3ZnXCIgd2lkdGg9XCIxMDFcIiBoZWlnaHQ9XCI0NFwiPlxuICAgICAgICA8L2J1dHRvbj5cbiAgICAgIDwvZGl2PlxuICAgICAgJHt0aGlzLnRlbXBsYXRlVGltZXJ9XG4gICAgICAke3RoaXMudGVtcGxhdGVMaXZlc31gXG4gICAgKTtcbiAgfVxuXG4gIGdldCB0ZW1wbGF0ZVRpbWVyKCkge1xuICAgIGlmICghKHRoaXMudmlldyBpbnN0YW5jZW9mIEdhbWVWaWV3KSkge1xuICAgICAgcmV0dXJuIGBgO1xuICAgIH1cbiAgICByZXR1cm4gYDxoMSBjbGFzcz1cImdhbWVfX3RpbWVyXCI+Tk48L2gxPmA7XG4gIH1cblxuICBnZXQgdGVtcGxhdGVMaXZlcygpIHtcbiAgICBpZiAoISh0aGlzLnZpZXcgaW5zdGFuY2VvZiBHYW1lVmlldykpIHtcbiAgICAgIHJldHVybiBgYDtcbiAgICB9XG5cbiAgICBjb25zdCBsaXZlcyA9IFtdO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgaW5pdGlhbFN0YXRlLmxpdmVzIC0gdGhpcy52aWV3Lm1vZGVsLnN0YXRlLmxpdmVzOyBpKyspIHtcbiAgICAgIGxpdmVzLnB1c2goYDxpbWcgc3JjPVwiaW1nL2hlYXJ0X19lbXB0eS5zdmdcIiBjbGFzcz1cImdhbWVfX2hlYXJ0XCIgYWx0PVwiTGlmZVwiIHdpZHRoPVwiMzJcIiBoZWlnaHQ9XCIzMlwiPmApO1xuICAgIH1cbiAgICBmb3IgKGxldCBqID0gMDsgaiA8IHRoaXMudmlldy5tb2RlbC5zdGF0ZS5saXZlczsgaisrKSB7XG4gICAgICBsaXZlcy5wdXNoKGA8aW1nIHNyYz1cImltZy9oZWFydF9fZnVsbC5zdmdcIiBjbGFzcz1cImdhbWVfX2hlYXJ0XCIgYWx0PVwiTGlmZVwiIHdpZHRoPVwiMzJcIiBoZWlnaHQ9XCIzMlwiPmApO1xuICAgIH1cblxuICAgIHJldHVybiBgPGRpdiBjbGFzcz1cImdhbWVfX2xpdmVzXCI+JHtsaXZlcy5qb2luKGAgYCl9PC9kaXY+YDtcbiAgfVxuXG4gIGRpc3BsYXlUaW1lcigpIHtcbiAgICBpZiAodGhpcy5zdGF0ZS50aW1lIDw9IDUpIHtcbiAgICAgIHRoaXMudGltZXIuY2xhc3NMaXN0LmFkZChgZ2FtZV9fdGltZXItLXNtYWxsLXRpbWVgKTtcbiAgICB9XG4gICAgdGhpcy50aW1lci50ZXh0Q29udGVudCA9IHRoaXMuc3RhdGUudGltZTtcbiAgfVxuXG4gIHRpY2soKSB7XG4gICAgdGhpcy5kaXNwbGF5VGltZXIoKTtcbiAgICB0aGlzLnN0YXRlLnRpbWVySWQgPSB3aW5kb3cuc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAtLXRoaXMuc3RhdGUudGltZTtcblxuICAgICAgaWYgKHRoaXMuc3RhdGUudGltZSA+IEdhbWVQYXJhbWV0ZXJzLk1JTl9DT1VOVF9USU1FKSB7XG4gICAgICAgIHRoaXMudGljaygpO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICB0aGlzLnZpZXcucGxheWVyLnRpY2soKTtcblxuICAgIH0sIEdhbWVQYXJhbWV0ZXJzLkFNT1VOVF9NSUxJU0VDT05EU19JTl9TRUNPTkRTKTtcbiAgfVxuXG4gIGJpbmQoZWxlbWVudCkge1xuICAgIGNvbnN0IGJ1dHRvbkJhY2sgPSBlbGVtZW50LnF1ZXJ5U2VsZWN0b3IoYC5iYWNrYCk7XG4gICAgYnV0dG9uQmFjay5vbmNsaWNrID0gKGV2dCkgPT4gdGhpcy5idXR0b25CYWNrSGFuZGxlcihldnQpO1xuXG4gICAgY29uc3QgdGltZXIgPSBlbGVtZW50LnF1ZXJ5U2VsZWN0b3IoYC5nYW1lX190aW1lcmApO1xuICAgIGlmICh0aW1lcikge1xuICAgICAgdGhpcy50aW1lciA9IHRpbWVyO1xuICAgICAgdGhpcy5zdGF0ZSA9IHRoaXMudmlldy5tb2RlbC5zdGF0ZTtcbiAgICAgIHRoaXMudGljaygpO1xuICAgIH1cbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBQbGF5ZXJWaWV3O1xuIiwiaW1wb3J0IFBsYXllclZpZXcgZnJvbSAnLi4vdmlld3MvcGxheWVyLXZpZXcnO1xuaW1wb3J0IFV0aWxzIGZyb20gJy4vdXRpbHMnO1xuXG5jb25zdCBkaXNwbGF5SGVhZGVyID0gKHZpZXcpID0+IHtcbiAgY29uc3QgcGxheWVyID0gbmV3IFBsYXllclZpZXcodmlldykuZWxlbWVudDtcbiAgVXRpbHMuZGlzcGxheUVsZW1lbnQocGxheWVyLCB2aWV3LmhlYWRlcik7XG59O1xuXG5leHBvcnQgZGVmYXVsdCBkaXNwbGF5SGVhZGVyO1xuIiwiaW1wb3J0IEFic3RyYWN0VmlldyBmcm9tICcuL2Fic3RyYWN0LXZpZXcnO1xuaW1wb3J0IGRpc3BsYXlIZWFkZXIgZnJvbSAnLi4vbGliL2Rpc3BsYXktaGVhZGVyJztcblxuY2xhc3MgUnVsZXNWaWV3IGV4dGVuZHMgQWJzdHJhY3RWaWV3IHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgc3VwZXIoKTtcbiAgfVxuXG4gIGdldCB0ZW1wbGF0ZSgpIHtcbiAgICByZXR1cm4gKFxuICAgICAgYDxoZWFkZXIgY2xhc3M9XCJoZWFkZXJcIj48L2hlYWRlcj5cbiAgICAgIDxkaXYgY2xhc3M9XCJydWxlc1wiPlxuICAgICAgICA8aDEgY2xhc3M9XCJydWxlc19fdGl0bGVcIj7Qn9GA0LDQstC40LvQsDwvaDE+XG4gICAgICAgIDxwIGNsYXNzPVwicnVsZXNfX2Rlc2NyaXB0aW9uXCI+0KPQs9Cw0LTQsNC5IDEwINGA0LDQtyDQtNC70Y8g0LrQsNC20LTQvtCz0L4g0LjQt9C+0LHRgNCw0LbQtdC90LjRjyDRhNC+0YLQviA8aW1nXG4gICAgICAgICAgc3JjPVwiaW1nL3Bob3RvX2ljb24ucG5nXCIgd2lkdGg9XCIxNlwiIGhlaWdodD1cIjE2XCI+INC40LvQuCDRgNC40YHRg9C90L7QuiA8aW1nXG4gICAgICAgICAgc3JjPVwiaW1nL3BhaW50X2ljb24ucG5nXCIgd2lkdGg9XCIxNlwiIGhlaWdodD1cIjE2XCIgYWx0PVwiXCI+Ljxicj5cbiAgICAgICAgICDQpNC+0YLQvtCz0YDQsNGE0LjRj9C80Lgg0LjQu9C4INGA0LjRgdGD0L3QutCw0LzQuCDQvNC+0LPRg9GCINCx0YvRgtGMINC+0LHQsCDQuNC30L7QsdGA0LDQttC10L3QuNGPLjxicj5cbiAgICAgICAgICDQndCwINC60LDQttC00YPRjiDQv9C+0L/Ri9GC0LrRgyDQvtGC0LLQvtC00LjRgtGB0Y8gMzAg0YHQtdC60YPQvdC0Ljxicj5cbiAgICAgICAgICDQntGI0LjQsdC40YLRjNGB0Y8g0LzQvtC20L3QviDQvdC1INCx0L7Qu9C10LUgMyDRgNCw0LcuPGJyPlxuICAgICAgICAgIDxicj5cbiAgICAgICAgICDQk9C+0YLQvtCy0Ys/XG4gICAgICAgIDwvcD5cbiAgICAgICAgPGZvcm0gY2xhc3M9XCJydWxlc19fZm9ybVwiPlxuICAgICAgICAgIDxpbnB1dCBjbGFzcz1cInJ1bGVzX19pbnB1dFwiIHR5cGU9XCJ0ZXh0XCIgcGxhY2Vob2xkZXI9XCLQktCw0YjQtSDQmNC80Y9cIiByZXF1aXJlZD5cbiAgICAgICAgICA8YnV0dG9uIGNsYXNzPVwicnVsZXNfX2J1dHRvbiAgY29udGludWVcIiB0eXBlPVwic3VibWl0XCIgZGlzYWJsZWQ+R28hPC9idXR0b24+XG4gICAgICAgIDwvZm9ybT5cbiAgICAgIDwvZGl2PmBcbiAgICApO1xuICB9XG5cbiAgYmluZChlbGVtZW50KSB7XG4gICAgdGhpcy5oZWFkZXIgPSBlbGVtZW50LnF1ZXJ5U2VsZWN0b3IoYC5oZWFkZXJgKTtcbiAgICBkaXNwbGF5SGVhZGVyKHRoaXMpO1xuXG4gICAgY29uc3QgZm9ybSA9IGVsZW1lbnQucXVlcnlTZWxlY3RvcihgLnJ1bGVzX19mb3JtYCk7XG4gICAgZm9ybS5vbnN1Ym1pdCA9IChldnQpID0+IHRoaXMuZm9ybVN1Ym1pdEhhbmRsZXIoZXZ0KTtcblxuICAgIGNvbnN0IGlucHV0ID0gZWxlbWVudC5xdWVyeVNlbGVjdG9yKGAucnVsZXNfX2lucHV0YCk7XG4gICAgaW5wdXQub25pbnB1dCA9IChldnQpID0+IHRoaXMuY2tlY2tlZElucHV0KGV2dCk7XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgUnVsZXNWaWV3O1xuIiwiaW1wb3J0IEFwcCBmcm9tICcuLi9hcHBsaWNhdGlvbic7XG5pbXBvcnQge0dhbWVQYXJhbWV0ZXJzfSBmcm9tICcuLi9kYXRhL2RhdGEnO1xuXG5jbGFzcyBQbGF5ZXJTY3JlZW4ge1xuICBpbml0KGdhbWVWaWV3KSB7XG4gICAgdGhpcy5idXR0b25CYWNrSGFuZGxlciA9IChldnQpID0+IHtcbiAgICAgIGV2dC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgQXBwLnNob3dHcmVldGluZ1NjcmVlbigpO1xuICAgICAgaWYgKGdhbWVWaWV3KSB7XG4gICAgICAgIHdpbmRvdy5jbGVhclRpbWVvdXQoZ2FtZU1vZGVsLnN0YXRlLnRpbWVySWQpO1xuICAgICAgfVxuICAgIH07XG5cbiAgICBpZiAoIWdhbWVWaWV3KSB7XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICBjb25zdCBnYW1lTW9kZWwgPSBnYW1lVmlldy5tb2RlbDtcblxuICAgIHRoaXMudGljayA9ICgpID0+IHtcbiAgICAgIGlmIChnYW1lTW9kZWwuc3RhdGUudGltZSA+IEdhbWVQYXJhbWV0ZXJzLk1JTl9DT1VOVF9USU1FKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIC0tZ2FtZU1vZGVsLnN0YXRlLmxpdmVzO1xuICAgICAgKytnYW1lTW9kZWwuc3RhdGUubGV2ZWw7XG4gICAgICBnYW1lTW9kZWwuYWRkQW5zd2VyKGZhbHNlKTtcblxuICAgICAgaWYgKCFnYW1lTW9kZWwuaXNDYW5QbGF5KCkpIHtcbiAgICAgICAgQXBwLnNob3dTdGF0c1NjcmVlbihnYW1lTW9kZWwuc3RhdGUpO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBBcHAuc2hvd0dhbWVTY3JlZW4oZ2FtZU1vZGVsLnN0YXRlKTtcbiAgICB9O1xuXG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgbmV3IFBsYXllclNjcmVlbigpO1xuIiwiaW1wb3J0IEFwcCBmcm9tICcuLi9hcHBsaWNhdGlvbic7XG5pbXBvcnQgUnVsZXNWaWV3IGZyb20gJy4uL3ZpZXdzL3J1bGVzLXZpZXcnO1xuaW1wb3J0IFV0aWxzIGZyb20gJy4uL2xpYi91dGlscyc7XG5pbXBvcnQge2luaXRpYWxTdGF0ZX0gZnJvbSAnLi4vZGF0YS9kYXRhJztcbmltcG9ydCBwbGF5ZXIgZnJvbSAnLi9wbGF5ZXItc2NyZWVuJztcblxuY29uc3QgQU1PVU5UX1NJTUJPTFMgPSAyO1xuXG5jbGFzcyBSdWxlc1NjcmVlbiB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMudmlldyA9IG5ldyBSdWxlc1ZpZXcoKTtcbiAgfVxuXG4gIGluaXQoKSB7XG4gICAgdGhpcy52aWV3LmNrZWNrZWRJbnB1dCA9IChldnQpID0+IHtcbiAgICAgIGV2dC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgY29uc3QgdmFsdWUgPSBldnQuY3VycmVudFRhcmdldC52YWx1ZTtcblxuICAgICAgY29uc3QgZm9ybSA9IGV2dC5jdXJyZW50VGFyZ2V0LnBhcmVudEVsZW1lbnQ7XG4gICAgICBjb25zdCBydWxlc0J1dHRvbiA9IGZvcm0ucXVlcnlTZWxlY3RvcihgLnJ1bGVzX19idXR0b25gKTtcbiAgICAgIHJ1bGVzQnV0dG9uLmRpc2FibGVkID0gdHJ1ZTtcblxuICAgICAgaWYgKCF0aGlzLmNoZWNrSW5wdXQodmFsdWUpKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIHRoaXMudmFsdWUgPSB2YWx1ZTtcbiAgICAgIHJ1bGVzQnV0dG9uLmRpc2FibGVkID0gZmFsc2U7XG4gICAgfTtcblxuICAgIHRoaXMudmlldy5mb3JtU3VibWl0SGFuZGxlciA9IChldnQpID0+IHtcbiAgICAgIGV2dC5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgICBjb25zdCBzdGF0ZSA9IE9iamVjdC5hc3NpZ24oe30sIGluaXRpYWxTdGF0ZSk7XG4gICAgICBzdGF0ZS5hbnN3ZXJzID0gW107XG4gICAgICBzdGF0ZS5uYW1lID0gdGhpcy52YWx1ZTtcblxuICAgICAgQXBwLnNob3dHYW1lU2NyZWVuKHN0YXRlKTtcbiAgICB9O1xuXG4gICAgdGhpcy52aWV3LnBsYXllciA9IHBsYXllci5pbml0KCk7XG5cbiAgICBVdGlscy5kaXNwbGF5U2NyZWVuKHRoaXMudmlldy5lbGVtZW50KTtcbiAgfVxuXG4gIGNoZWNrSW5wdXQodmFsdWUpIHtcbiAgICBjb25zdCBjaGVja2VkU2ltYm9scyA9IC9be30qPD4sLj8hQCMkOjslXiYnXCJcXFxcfC9cXHNdLztcbiAgICBjb25zdCByZXN1bHRDaGVja1NpbWJvbHMgPSAhY2hlY2tlZFNpbWJvbHMudGVzdCh2YWx1ZSk7XG5cbiAgICByZXR1cm4gKFxuICAgICAgdmFsdWUubGVuZ3RoID49IEFNT1VOVF9TSU1CT0xTICYmXG4gICAgICByZXN1bHRDaGVja1NpbWJvbHNcbiAgICApO1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IG5ldyBSdWxlc1NjcmVlbigpO1xuIiwiaW1wb3J0IFV0aWxzIGZyb20gJy4uL2xpYi91dGlscyc7XG5pbXBvcnQge2luaXRpYWxTdGF0ZSwgR2FtZVBhcmFtZXRlcnN9IGZyb20gJy4uL2RhdGEvZGF0YSc7XG5cbmNvbnN0IHRpbWVBbnN3ZXJzID0ge1xuICBGQVNUOiAxMCxcbiAgU0xPVzogMjBcbn07XG5cbmNsYXNzIEdhbWVNb2RlbCB7XG4gIGNvbnN0cnVjdG9yKGRhdGEsIGltYWdlc0J1ZmZlcikge1xuICAgIHRoaXMuZGF0YSA9IGRhdGE7XG4gICAgdGhpcy5pbWFnZXNCdWZmZXIgPSBpbWFnZXNCdWZmZXI7XG4gIH1cblxuICB1cGRhdGVTdGF0ZShuZXdTdGF0ZSkge1xuICAgIHRoaXMuc3RhdGUgPSBuZXdTdGF0ZTtcbiAgICB0aGlzLnJlc2V0VGltZXIoKTtcbiAgfVxuXG4gIHJlc2V0VGltZXIoKSB7XG4gICAgdGhpcy5zdGF0ZS50aW1lID0gaW5pdGlhbFN0YXRlLnRpbWU7XG4gIH1cblxuICBpc0NhblBsYXkoKSB7XG4gICAgcmV0dXJuIChcbiAgICAgICh0aGlzLnN0YXRlLmxldmVsIDwgR2FtZVBhcmFtZXRlcnMuTlVNQkVSX0FOU1dFUlMpICYmXG4gICAgICAodGhpcy5zdGF0ZS5hbnN3ZXJzLmxlbmd0aCA8IEdhbWVQYXJhbWV0ZXJzLk5VTUJFUl9BTlNXRVJTKSAmJlxuICAgICAgKHRoaXMuc3RhdGUubGl2ZXMgPj0gR2FtZVBhcmFtZXRlcnMuTUlOX0NPVU5UX0xJVkVTKVxuICAgICk7XG4gIH1cblxuICBnZXQgY3VycmVudExldmVsKCkge1xuICAgIHJldHVybiBVdGlscy5nZXRMZXZlbCh0aGlzLnN0YXRlLmxldmVsLCB0aGlzLmRhdGEpO1xuICB9XG5cbiAgc3RhdGljIGdldFR5cGVBbnN3ZXIoYW5zd2VyLCB0aW1lKSB7XG4gICAgaWYgKCFhbnN3ZXIpIHtcbiAgICAgIHJldHVybiBgd3JvbmdgO1xuICAgIH1cbiAgICBpZiAodGltZSA8IHRpbWVBbnN3ZXJzLkZBU1QpIHtcbiAgICAgIHJldHVybiBgZmFzdGA7XG4gICAgfVxuICAgIGlmICh0aW1lID49IHRpbWVBbnN3ZXJzLkZBU1QgJiYgdGltZSA8IHRpbWVBbnN3ZXJzLlNMT1cpIHtcbiAgICAgIHJldHVybiBgY29ycmVjdGA7XG4gICAgfVxuICAgIGlmICh0aW1lID49IHRpbWVBbnN3ZXJzLlNMT1cgJiYgdGltZSA8IGluaXRpYWxTdGF0ZS50aW1lKSB7XG4gICAgICByZXR1cm4gYHNsb3dgO1xuICAgIH1cbiAgICByZXR1cm4gYHdyb25nYDtcbiAgfVxuXG4gIGFkZEFuc3dlcihhbnN3ZXIsIHRpbWUpIHtcbiAgICB0aW1lID0gKG5ldyBEYXRlKCkgLSB0aW1lKSAvIEdhbWVQYXJhbWV0ZXJzLkFNT1VOVF9NSUxJU0VDT05EU19JTl9TRUNPTkRTO1xuICAgIGNvbnN0IHR5cGUgPSBHYW1lTW9kZWwuZ2V0VHlwZUFuc3dlcihhbnN3ZXIsIHRpbWUpO1xuICAgIHRoaXMuc3RhdGUuYW5zd2Vycy5wdXNoKHR5cGUpO1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IEdhbWVNb2RlbDtcbiIsImNsYXNzIExldmVsRmlyc3RUeXBlU2NyZWVuIHtcbiAgaW5pdChnYW1lVmlldykge1xuICAgIHRoaXMuZ2FtZU1vZGVsID0gZ2FtZVZpZXcubW9kZWw7XG4gICAgdGhpcy5jdXJyZW50TGV2ZWwgPSB0aGlzLmdhbWVNb2RlbC5jdXJyZW50TGV2ZWw7XG5cbiAgICB0aGlzLmFuc3dlckhhbmRsZXIgPSAoZXZ0LCBmb3JtKSA9PiB7XG4gICAgICBldnQucHJldmVudERlZmF1bHQoKTtcblxuICAgICAgY29uc3QgZ2FtZU9wdGlvbnMgPSBmb3JtLnF1ZXJ5U2VsZWN0b3JBbGwoYC5nYW1lX19vcHRpb25gKTtcbiAgICAgIGlmICghTGV2ZWxGaXJzdFR5cGVTY3JlZW4uY2hlY2tGb3JtKGdhbWVPcHRpb25zKSkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IGFuc3dlciA9IHRoaXMuZ2V0QW5zd2VyKGdhbWVPcHRpb25zKTtcbiAgICAgIGdhbWVWaWV3LnNob3dOZXh0U2NyZWVuKGFuc3dlcik7XG4gICAgfTtcblxuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgc3RhdGljIGNoZWNrRm9ybShnYW1lT3B0aW9ucykge1xuICAgIHJldHVybiBbLi4uZ2FtZU9wdGlvbnNdLmV2ZXJ5KChvcHRpb24pID0+IHtcbiAgICAgIGNvbnN0IGdyb3VwUmFkaW9zID0gb3B0aW9uLnF1ZXJ5U2VsZWN0b3JBbGwoYGlucHV0W3R5cGU9J3JhZGlvJ11gKTtcbiAgICAgIHJldHVybiBbLi4uZ3JvdXBSYWRpb3NdLnNvbWUoKHJhZGlvKSA9PiByYWRpby5jaGVja2VkKTtcbiAgICB9KTtcbiAgfVxuXG4gIGdldEFuc3dlcihnYW1lT3B0aW9ucykge1xuICAgIHJldHVybiBbLi4uZ2FtZU9wdGlvbnNdLmV2ZXJ5KChvcHRpb24sIGluZGV4KSA9PiB7XG4gICAgICBjb25zdCBpbWFnZVR5cGUgPSB0aGlzLmN1cnJlbnRMZXZlbC5pbWFnZXNbaW5kZXhdLnR5cGU7XG4gICAgICBjb25zdCBncm91cFJhZGlvcyA9IG9wdGlvbi5xdWVyeVNlbGVjdG9yQWxsKGBpbnB1dFt0eXBlPSdyYWRpbyddYCk7XG5cbiAgICAgIHJldHVybiBbLi4uZ3JvdXBSYWRpb3NdLnNvbWUoKHJhZGlvKSA9PiB7XG4gICAgICAgIGlmIChyYWRpby5jaGVja2VkKSB7XG4gICAgICAgICAgcmV0dXJuIHJhZGlvLnZhbHVlID09PSBpbWFnZVR5cGU7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfSk7XG4gICAgfSk7XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgbmV3IExldmVsRmlyc3RUeXBlU2NyZWVuKCk7XG4iLCJjbGFzcyBMZXZlbFNlY29uZFR5cGVTY3JlZW4ge1xuICBpbml0KGdhbWVWaWV3KSB7XG4gICAgY29uc3QgZ2FtZU1vZGVsID0gZ2FtZVZpZXcubW9kZWw7XG4gICAgdGhpcy5jdXJyZW50TGV2ZWwgPSBnYW1lTW9kZWwuY3VycmVudExldmVsO1xuXG4gICAgdGhpcy5hbnN3ZXJIYW5kbGVyID0gKGV2dCkgPT4ge1xuICAgICAgZXZ0LnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICAgIGNvbnN0IGFuc3dlciA9IHRoaXMuZ2V0QW5zd2VyKGV2dC5jdXJyZW50VGFyZ2V0KTtcbiAgICAgIGdhbWVWaWV3LnNob3dOZXh0U2NyZWVuKGFuc3dlcik7XG4gICAgfTtcblxuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgZ2V0QW5zd2VyKHJhZGlvKSB7XG4gICAgY29uc3QgaW1hZ2VUeXBlID0gdGhpcy5jdXJyZW50TGV2ZWwuaW1hZ2UudHlwZTtcbiAgICByZXR1cm4gcmFkaW8udmFsdWUgPT09IGltYWdlVHlwZTtcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBuZXcgTGV2ZWxTZWNvbmRUeXBlU2NyZWVuKCk7XG4iLCJjbGFzcyBMZXZlbFRoaXJkVHlwZVNjcmVlbiB7XG4gIGluaXQoZ2FtZVZpZXcpIHtcbiAgICBjb25zdCBnYW1lTW9kZWwgPSBnYW1lVmlldy5tb2RlbDtcbiAgICB0aGlzLmN1cnJlbnRMZXZlbCA9IGdhbWVNb2RlbC5jdXJyZW50TGV2ZWw7XG5cbiAgICB0aGlzLmFuc3dlckhhbmRsZXIgPSAoZXZ0KSA9PiB7XG4gICAgICBldnQucHJldmVudERlZmF1bHQoKTtcblxuICAgICAgY29uc3QgYW5zd2VyID0gdGhpcy5nZXRBbnN3ZXIoZXZ0LmN1cnJlbnRUYXJnZXQpO1xuICAgICAgZ2FtZVZpZXcuc2hvd05leHRTY3JlZW4oYW5zd2VyKTtcbiAgICB9O1xuXG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICBnZXRBbnN3ZXIodGFyZ2V0KSB7XG4gICAgY29uc3QgaW1hZ2VTcmMgPSB0YXJnZXQucXVlcnlTZWxlY3RvcihgaW1nYCkuc3JjO1xuICAgIGNvbnN0IHNlbGVjdGVkSW1hZ2UgPSB0aGlzLmN1cnJlbnRMZXZlbC5pbWFnZXMuZmluZCgoaW1hZ2UpID0+IHtcbiAgICAgIHJldHVybiBpbWFnZS51cmwgPT09IGltYWdlU3JjO1xuICAgIH0pO1xuICAgIHJldHVybiBzZWxlY3RlZEltYWdlLnR5cGUgPT09IHRoaXMuY3VycmVudExldmVsLmFuc3dlcjtcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBuZXcgTGV2ZWxUaGlyZFR5cGVTY3JlZW4oKTtcbiIsImltcG9ydCBBcHAgZnJvbSAnLi4vYXBwbGljYXRpb24nO1xuaW1wb3J0IEdhbWVNb2RlbCBmcm9tICcuLi9tb2RlbHMvZ2FtZS1tb2RlbCc7XG5pbXBvcnQgR2FtZVZpZXcgZnJvbSAnLi4vdmlld3MvZ2FtZS12aWV3JztcbmltcG9ydCBVdGlscyBmcm9tICcuLi9saWIvdXRpbHMnO1xuaW1wb3J0IHBsYXllciBmcm9tICcuL3BsYXllci1zY3JlZW4nO1xuaW1wb3J0IGZpcnN0TGV2ZWxUeXBlIGZyb20gJy4vbGV2ZWwtZmlyc3QtdHlwZS1zY3JlZW4nO1xuaW1wb3J0IHNlY29uZExldmVsVHlwZSBmcm9tICcuL2xldmVsLXNlY29uZC10eXBlLXNjcmVlbic7XG5pbXBvcnQgdGhpcmRMZXZlbFR5cGUgZnJvbSAnLi9sZXZlbC10aGlyZC10eXBlLXNjcmVlbic7XG5cbmNsYXNzIEdhbWVTY3JlZW4ge1xuICBjb25zdHJ1Y3RvcihnYW1lRGF0YSwgaW1hZ2VzQnVmZmVyKSB7XG4gICAgdGhpcy5tb2RlbCA9IG5ldyBHYW1lTW9kZWwoZ2FtZURhdGEsIGltYWdlc0J1ZmZlcik7XG4gIH1cblxuICBpbml0KHN0YXRlKSB7XG4gICAgdGhpcy5tb2RlbC51cGRhdGVTdGF0ZShzdGF0ZSk7XG4gICAgdGhpcy52aWV3ID0gbmV3IEdhbWVWaWV3KHRoaXMubW9kZWwpO1xuICAgIGNvbnN0IHRpbWUgPSBuZXcgRGF0ZSgpO1xuXG4gICAgdGhpcy52aWV3LnNob3dOZXh0U2NyZWVuID0gKGFuc3dlcikgPT4ge1xuICAgICAgd2luZG93LmNsZWFyVGltZW91dCh0aGlzLnZpZXcubW9kZWwuc3RhdGUudGltZXJJZCk7XG5cbiAgICAgIGlmICghYW5zd2VyKSB7XG4gICAgICAgIC0tc3RhdGUubGl2ZXM7XG4gICAgICB9XG4gICAgICB0aGlzLm1vZGVsLmFkZEFuc3dlcihhbnN3ZXIsIHRpbWUpO1xuXG4gICAgICArK3N0YXRlLmxldmVsO1xuICAgICAgaWYgKHRoaXMubW9kZWwuaXNDYW5QbGF5KCkpIHtcbiAgICAgICAgQXBwLnNob3dHYW1lU2NyZWVuKHN0YXRlKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgQXBwLnNob3dTdGF0c1NjcmVlbihzdGF0ZSk7XG4gICAgfTtcblxuICAgIHRoaXMudmlldy5wbGF5ZXIgPSBwbGF5ZXIuaW5pdCh0aGlzLnZpZXcpO1xuICAgIHRoaXMudmlldy5maXJzdExldmVsVHlwZSA9IGZpcnN0TGV2ZWxUeXBlLmluaXQodGhpcy52aWV3KTtcbiAgICB0aGlzLnZpZXcuc2Vjb25kTGV2ZWxUeXBlID0gc2Vjb25kTGV2ZWxUeXBlLmluaXQodGhpcy52aWV3KTtcbiAgICB0aGlzLnZpZXcudGhpcmRMZXZlbFR5cGUgPSB0aGlyZExldmVsVHlwZS5pbml0KHRoaXMudmlldyk7XG5cbiAgICBVdGlscy5kaXNwbGF5U2NyZWVuKHRoaXMudmlldy5lbGVtZW50KTtcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBHYW1lU2NyZWVuO1xuIiwiaW1wb3J0IHthbW91bnRQb2ludHN9IGZyb20gJy4uL2RhdGEvZGF0YSc7XG5pbXBvcnQgVXRpbHMgZnJvbSAnLi91dGlscyc7XG5cbmNvbnN0IGdldEN1cnJlbnRSZXN1bHQgPSAoc3RhdGUpID0+IHtcbiAgY29uc3QgY3VycmVudFJlc3VsdCA9IHtcbiAgICBhbW91bnRDb3JyZWN0QW5zd2VyczogMCxcbiAgICBhbW91bnRGYXN0QW5zd2VyczogMCxcbiAgICBhbW91bnRTbG93QW5zd2VyczogMCxcbiAgICBhbW91bnRMaXZlc0xlZnQ6IHN0YXRlLmxpdmVzXG4gIH07XG5cbiAgY29uc3QgY291bnRUb3RhbFBvaW50cyA9ICgoc3VtLCBpdGVtKSA9PiB7XG4gICAgc3dpdGNoIChpdGVtKSB7XG4gICAgICBjYXNlIGBjb3JyZWN0YDpcbiAgICAgICAgKytjdXJyZW50UmVzdWx0LmFtb3VudENvcnJlY3RBbnN3ZXJzO1xuICAgICAgICBzdW0gKz0gMTAwO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgYGZhc3RgOlxuICAgICAgICArK2N1cnJlbnRSZXN1bHQuYW1vdW50Q29ycmVjdEFuc3dlcnM7XG4gICAgICAgICsrY3VycmVudFJlc3VsdC5hbW91bnRGYXN0QW5zd2VycztcbiAgICAgICAgc3VtICs9IDE1MDtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIGBzbG93YDpcbiAgICAgICAgKytjdXJyZW50UmVzdWx0LmFtb3VudENvcnJlY3RBbnN3ZXJzO1xuICAgICAgICArK2N1cnJlbnRSZXN1bHQuYW1vdW50U2xvd0Fuc3dlcnM7XG4gICAgICAgIHN1bSArPSA1MDtcbiAgICAgICAgYnJlYWs7XG4gICAgfVxuICAgIHJldHVybiBzdW07XG4gIH0pO1xuXG4gIGxldCB0b3RhbFBvaW50cyA9IHN0YXRlLmFuc3dlcnMucmVkdWNlKGNvdW50VG90YWxQb2ludHMsIDApICtcbiAgICAgIGN1cnJlbnRSZXN1bHQuYW1vdW50TGl2ZXNMZWZ0ICogNTA7XG5cbiAgcmV0dXJuIHtcbiAgICB0b3RhbFBvaW50cyxcblxuICAgIGNvcnJlY3RBbnN3ZXJzOiB7XG4gICAgICBwb2ludHNQZXJVbml0OiBhbW91bnRQb2ludHMuQ09SUkVDVF9BTlNXRVIsXG4gICAgICBhbW91bnQ6IGN1cnJlbnRSZXN1bHQuYW1vdW50Q29ycmVjdEFuc3dlcnMsXG4gICAgICBwb2ludHM6IFV0aWxzLmNvdW50T2ZQb2ludHMoY3VycmVudFJlc3VsdC5hbW91bnRDb3JyZWN0QW5zd2VycywgYW1vdW50UG9pbnRzLkNPUlJFQ1RfQU5TV0VSKVxuICAgIH0sXG5cbiAgICBib251c2VzQW5kUGVuYWx0aWVzOiBbXG4gICAgICB7XG4gICAgICAgIHRpdGxlOiBg0JHQvtC90YPRgSDQt9CwINGB0LrQvtGA0L7RgdGC0YxgLFxuICAgICAgICB0eXBlOiBgZmFzdGAsXG4gICAgICAgIHBvaW50c1BlclVuaXQ6IGFtb3VudFBvaW50cy5CT05VU19GT1JfRkFTVF9BTlNXRVIsXG4gICAgICAgIGFtb3VudDogY3VycmVudFJlc3VsdC5hbW91bnRGYXN0QW5zd2VycyxcbiAgICAgICAgcG9pbnRzOiBVdGlscy5jb3VudE9mUG9pbnRzKGN1cnJlbnRSZXN1bHQuYW1vdW50RmFzdEFuc3dlcnMsIGFtb3VudFBvaW50cy5CT05VU19GT1JfRkFTVF9BTlNXRVIpXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICB0aXRsZTogYNCR0L7QvdGD0YEg0LfQsCDQttC40LfQvdC4YCxcbiAgICAgICAgdHlwZTogYGFsaXZlYCxcbiAgICAgICAgcG9pbnRzUGVyVW5pdDogYW1vdW50UG9pbnRzLkJPTlVTX0ZPUl9MSVZFU19MRUZULFxuICAgICAgICBhbW91bnQ6IGN1cnJlbnRSZXN1bHQuYW1vdW50TGl2ZXNMZWZ0LFxuICAgICAgICBwb2ludHM6IFV0aWxzLmNvdW50T2ZQb2ludHMoY3VycmVudFJlc3VsdC5hbW91bnRMaXZlc0xlZnQsIGFtb3VudFBvaW50cy5CT05VU19GT1JfTElWRVNfTEVGVClcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIHRpdGxlOiBg0KjRgtGA0LDRhCDQt9CwINC80LXQtNC70LjRgtC10LvRjNC90L7RgdGC0YxgLFxuICAgICAgICB0eXBlOiBgc2xvd2AsXG4gICAgICAgIHBvaW50c1BlclVuaXQ6IC1hbW91bnRQb2ludHMuQk9OVVNfRk9SX1NMT1dfQU5TV0VSLFxuICAgICAgICBhbW91bnQ6IGN1cnJlbnRSZXN1bHQuYW1vdW50U2xvd0Fuc3dlcnMsXG4gICAgICAgIHBvaW50czogVXRpbHMuY291bnRPZlBvaW50cyhjdXJyZW50UmVzdWx0LmFtb3VudFNsb3dBbnN3ZXJzLCBhbW91bnRQb2ludHMuQk9OVVNfRk9SX1NMT1dfQU5TV0VSKVxuICAgICAgfVxuICAgIF1cbiAgfTtcbn07XG5cbmV4cG9ydCBkZWZhdWx0IGdldEN1cnJlbnRSZXN1bHQ7XG4iLCJpbXBvcnQgQWJzdHJhY3RWaWV3IGZyb20gJy4vYWJzdHJhY3Qtdmlldyc7XG5pbXBvcnQgZGlzcGxheUhlYWRlciBmcm9tICcuLi9saWIvZGlzcGxheS1oZWFkZXInO1xuaW1wb3J0IFV0aWxzIGZyb20gJy4uL2xpYi91dGlscyc7XG5pbXBvcnQge0dhbWVQYXJhbWV0ZXJzfSBmcm9tICcuLi9kYXRhL2RhdGEnO1xuaW1wb3J0IGdldEN1cnJlbnRSZXN1bHQgZnJvbSAnLi4vbGliL2dldC1jdXJyZW50LXJlc3VsdCc7XG5cbmNsYXNzIFJlc3VsdFZpZXcgZXh0ZW5kcyBBYnN0cmFjdFZpZXcge1xuICBjb25zdHJ1Y3RvcihkYXRhKSB7XG4gICAgc3VwZXIoKTtcbiAgICB0aGlzLmRhdGEgPSBkYXRhLnJldmVyc2UoKTtcbiAgfVxuXG4gIGdldCB0ZW1wbGF0ZSgpIHtcbiAgICByZXR1cm4gKFxuICAgICAgYDxoZWFkZXIgY2xhc3M9XCJoZWFkZXJcIj48L2hlYWRlcj5cbiAgICAgIDxkaXYgY2xhc3M9XCJyZXN1bHRcIj5cbiAgICAgICAgJHt0aGlzLnRlbXBsYXRlSGVhZGVyKHRoaXMuZGF0YVswXSl9XG4gICAgICAgICR7dGhpcy5kYXRhLm1hcCgoaXRlbSwgaW5kZXgpID0+IHRoaXMudGVtcGxhdGVSZXN1bHRUYWJsZShpdGVtLCBpbmRleCArIDEpKS5qb2luKGAgYCl9XG4gICAgICA8L2Rpdj5gXG4gICAgKTtcbiAgfVxuXG4gIGlzV2luKHN0YXRlKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIHN0YXRlLmFuc3dlcnMubGVuZ3RoID09PSBHYW1lUGFyYW1ldGVycy5OVU1CRVJfQU5TV0VSUyAmJlxuICAgICAgc3RhdGUubGl2ZXMgPj0gR2FtZVBhcmFtZXRlcnMuTUlOX0NPVU5UX0xJVkVTXG4gICAgKTtcbiAgfVxuXG4gIHRlbXBsYXRlSGVhZGVyKHN0YXRlKSB7XG4gICAgaWYgKHRoaXMuaXNXaW4oc3RhdGUpKSB7XG4gICAgICByZXR1cm4gYDxoMT7Qn9C+0LHQtdC00LAhPC9oMT5gO1xuICAgIH1cbiAgICByZXR1cm4gYDxoMT7Qn9C+0YDQsNC20LXQvdC40LUhPC9oMT5gO1xuICB9XG5cbiAgdGVtcGxhdGVSZXN1bHRUYWJsZShzdGF0ZSwgaW5kZXgpIHtcbiAgICBpZiAoIXRoaXMuaXNXaW4oc3RhdGUpKSB7XG4gICAgICByZXR1cm4gKFxuICAgICAgICBgPHRhYmxlIGNsYXNzPVwicmVzdWx0X190YWJsZVwiPlxuICAgICAgICAgIDx0cj5cbiAgICAgICAgICAgIDx0ZCBjbGFzcz1cInJlc3VsdF9fbnVtYmVyXCI+JHtpbmRleH0uPC90ZD5cbiAgICAgICAgICAgIDx0ZD5cbiAgICAgICAgICAgICAgJHtVdGlscy5nZXRTdGF0cyhzdGF0ZS5hbnN3ZXJzKX1cbiAgICAgICAgICAgIDwvdGQ+XG4gICAgICAgICAgICA8dGQgY2xhc3M9XCJyZXN1bHRfX3RvdGFsXCI+PC90ZD5cbiAgICAgICAgICAgIDx0ZCBjbGFzcz1cInJlc3VsdF9fdG90YWwgIHJlc3VsdF9fdG90YWwtLWZpbmFsXCI+ZmFpbDwvdGQ+XG4gICAgICAgICAgPC90cj5cbiAgICAgICAgPC90YWJsZT5gXG4gICAgICApO1xuICAgIH1cblxuICAgIGNvbnN0IGN1cnJlbnRSZXN1bHQgPSBnZXRDdXJyZW50UmVzdWx0KHN0YXRlKTtcblxuICAgIGNvbnN0IHJvd3MgPSBjdXJyZW50UmVzdWx0LmJvbnVzZXNBbmRQZW5hbHRpZXMubWFwKChpdGVtKSA9PiB0aGlzLmdldFRlbXBsYXRlUmVzdWx0Um93KGl0ZW0pKTtcblxuICAgIHJldHVybiAoXG4gICAgICBgPHRhYmxlIGNsYXNzPVwicmVzdWx0X190YWJsZVwiPlxuICAgICAgICA8dHI+XG4gICAgICAgICAgPHRkIGNsYXNzPVwicmVzdWx0X19udW1iZXJcIj4ke2luZGV4fS48L3RkPlxuICAgICAgICAgIDx0ZCBjb2xzcGFuPVwiMlwiPlxuICAgICAgICAgICAgJHtVdGlscy5nZXRTdGF0cyhzdGF0ZS5hbnN3ZXJzKX1cbiAgICAgICAgICA8L3RkPlxuICAgICAgICAgIDx0ZCBjbGFzcz1cInJlc3VsdF9fcG9pbnRzXCI+w5cmbmJzcDske2N1cnJlbnRSZXN1bHQuY29ycmVjdEFuc3dlcnMucG9pbnRzUGVyVW5pdH08L3RkPlxuICAgICAgICAgIDx0ZCBjbGFzcz1cInJlc3VsdF9fdG90YWxcIj4ke2N1cnJlbnRSZXN1bHQuY29ycmVjdEFuc3dlcnMucG9pbnRzfTwvdGQ+XG4gICAgICAgIDwvdHI+XG4gICAgICAgICR7cm93cy5qb2luKGAgYCl9XG4gICAgICAgIDx0cj5cbiAgICAgICAgICA8dGQgY29sc3Bhbj1cIjVcIiBjbGFzcz1cInJlc3VsdF9fdG90YWwgIHJlc3VsdF9fdG90YWwtLWZpbmFsXCI+JHtjdXJyZW50UmVzdWx0LnRvdGFsUG9pbnRzfTwvdGQ+XG4gICAgICAgIDwvdHI+XG4gICAgICA8L3RhYmxlPmBcbiAgICApO1xuICB9XG5cbiAgZ2V0VGVtcGxhdGVSZXN1bHRSb3coaXRlbSkge1xuICAgIGlmICghaXRlbS5hbW91bnQpIHtcbiAgICAgIHJldHVybiBgYDtcbiAgICB9XG4gICAgcmV0dXJuIChcbiAgICAgIGA8dHI+XG4gICAgICAgIDx0ZD48L3RkPlxuICAgICAgICA8dGQgY2xhc3M9XCJyZXN1bHRfX2V4dHJhXCI+JHtpdGVtLnRpdGxlfTo8L3RkPlxuICAgICAgICA8dGQgY2xhc3M9XCJyZXN1bHRfX2V4dHJhXCI+JHtpdGVtLmFtb3VudH0mbmJzcDs8c3BhbiBjbGFzcz1cInN0YXRzX19yZXN1bHQgc3RhdHNfX3Jlc3VsdC0tJHtpdGVtLnR5cGV9XCI+PC9zcGFuPjwvdGQ+XG4gICAgICAgIDx0ZCBjbGFzcz1cInJlc3VsdF9fcG9pbnRzXCI+w5cmbmJzcDske2l0ZW0ucG9pbnRzUGVyVW5pdH08L3RkPlxuICAgICAgICA8dGQgY2xhc3M9XCJyZXN1bHRfX3RvdGFsXCI+JHtpdGVtLnBvaW50c308L3RkPlxuICAgICAgPC90cj5gXG4gICAgKTtcbiAgfVxuXG4gIGJpbmQoZWxlbWVudCkge1xuICAgIHRoaXMuaGVhZGVyID0gZWxlbWVudC5xdWVyeVNlbGVjdG9yKGAuaGVhZGVyYCk7XG4gICAgZGlzcGxheUhlYWRlcih0aGlzKTtcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBSZXN1bHRWaWV3O1xuIiwiaW1wb3J0IFJlc3VsdFZpZXcgZnJvbSAnLi4vdmlld3MvcmVzdWx0LXZlaXcnO1xuaW1wb3J0IFV0aWxzIGZyb20gJy4uL2xpYi91dGlscyc7XG5pbXBvcnQgcGxheWVyIGZyb20gJy4vcGxheWVyLXNjcmVlbic7XG5cbmNsYXNzIFJlc3VsdFNjcmVlbiB7XG4gIGluaXQoc3RhdGUpIHtcbiAgICBjb25zdCB2aWV3ID0gbmV3IFJlc3VsdFZpZXcoc3RhdGUpO1xuICAgIHZpZXcucGxheWVyID0gcGxheWVyLmluaXQoKTtcblxuICAgIFV0aWxzLmRpc3BsYXlTY3JlZW4odmlldy5lbGVtZW50KTtcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBuZXcgUmVzdWx0U2NyZWVuKCk7XG4iLCJjb25zdCBUeXBlT2ZMZXZlbHMgPSB7XG4gIEZJUlNUOiBgdHdvLW9mLXR3b2AsXG4gIFNFQ09ORDogYHRpbmRlci1saWtlYCxcbiAgVEhJUkQ6IGBvbmUtb2YtdGhyZWVgXG59O1xuXG5jb25zdCBnZXRQYXJhbWV0ZXJzT2ZJbWFnZXMgPSAobGV2ZWwpID0+IHtcbiAgcmV0dXJuIGxldmVsLmFuc3dlcnMubWFwKChpdGVtKSA9PiB7XG4gICAgaWYgKGl0ZW0udHlwZSA9PT0gYHBhaW50aW5nYCkge1xuICAgICAgaXRlbS50eXBlID0gYHBhaW50YDtcbiAgICB9XG4gICAgcmV0dXJuIHtcbiAgICAgIHVybDogaXRlbS5pbWFnZS51cmwsXG4gICAgICB0eXBlOiBpdGVtLnR5cGVcbiAgICB9O1xuICB9KTtcbn07XG5cbmNvbnN0IGFkYXB0Rmlyc3RMZXZlbFR5cGUgPSAobGV2ZWwpID0+IHtcbiAgcmV0dXJuIHtcbiAgICBxdWVzdGlvbjogbGV2ZWwucXVlc3Rpb24sXG4gICAgdHlwZTogYGZpcnN0YCxcbiAgICBpbWFnZXM6IGdldFBhcmFtZXRlcnNPZkltYWdlcyhsZXZlbCwgYHRoaXJkYClcbiAgfTtcbn07XG5cbmNvbnN0IGFkYXB0U2Vjb25kTGV2ZWxUeXBlID0gKGxldmVsKSA9PiB7XG4gIHJldHVybiB7XG4gICAgcXVlc3Rpb246IGxldmVsLnF1ZXN0aW9uLFxuICAgIHR5cGU6IGBzZWNvbmRgLFxuICAgIGltYWdlOiBnZXRQYXJhbWV0ZXJzT2ZJbWFnZXMobGV2ZWwpWzBdXG4gIH07XG59O1xuXG5jb25zdCBhZGFwdFRoaXJkTGV2ZWxUeXBlID0gKGxldmVsKSA9PiB7XG4gIGxldCBhbW91bnRQYWludCA9IDA7XG5cbiAgY29uc3QgaW1hZ2VzID0gbGV2ZWwuYW5zd2Vycy5tYXAoKGl0ZW0pID0+IHtcbiAgICBpZiAoaXRlbS50eXBlID09PSBgcGFpbnRpbmdgKSB7XG4gICAgICBpdGVtLnR5cGUgPSBgcGFpbnRgO1xuICAgICAgKythbW91bnRQYWludDtcbiAgICB9XG4gICAgcmV0dXJuIHtcbiAgICAgIHVybDogaXRlbS5pbWFnZS51cmwsXG4gICAgICB3aWR0aDogaXRlbS5pbWFnZS53aWR0aCxcbiAgICAgIGhlaWdodDogaXRlbS5pbWFnZS5oZWlnaHQsXG4gICAgICB0eXBlOiBpdGVtLnR5cGVcbiAgICB9O1xuICB9KTtcblxuICBsZXQgYW5zd2VyID0gYHBhaW50YDtcbiAgaWYgKGFtb3VudFBhaW50ID09PSAyKSB7XG4gICAgYW5zd2VyID0gYHBob3RvYDtcbiAgfVxuICByZXR1cm4ge1xuICAgIHF1ZXN0aW9uOiBsZXZlbC5xdWVzdGlvbixcbiAgICBhbnN3ZXIsXG4gICAgdHlwZTogYHRoaXJkYCxcbiAgICBpbWFnZXNcbiAgfTtcbn07XG5cbmNvbnN0IEFkYXB0VHlwZU9mTGV2ZWxzID0ge1xuICBbVHlwZU9mTGV2ZWxzLkZJUlNUXTogYWRhcHRGaXJzdExldmVsVHlwZSxcbiAgW1R5cGVPZkxldmVscy5TRUNPTkRdOiBhZGFwdFNlY29uZExldmVsVHlwZSxcbiAgW1R5cGVPZkxldmVscy5USElSRF06IGFkYXB0VGhpcmRMZXZlbFR5cGVcbn07XG5cbmNvbnN0IGFkYXB0ID0gKGRhdGEpID0+IHtcbiAgcmV0dXJuIGRhdGEubWFwKChpdGVtKSA9PiB7XG4gICAgcmV0dXJuIEFkYXB0VHlwZU9mTGV2ZWxzW2l0ZW0udHlwZV0oaXRlbSk7XG4gIH0pO1xufTtcblxuZXhwb3J0IGRlZmF1bHQgYWRhcHQ7XG4iLCJjb25zdCBsb2FkSW1hZ2UgPSAodXJsKSA9PiB7XG4gIHJldHVybiBuZXcgUHJvbWlzZSgob25Mb2FkLCBvbkVycm9yKSA9PiB7XG4gICAgY29uc3QgaW1hZ2UgPSBuZXcgSW1hZ2UoKTtcbiAgICBpbWFnZS5vbmxvYWQgPSAoKSA9PiBvbkxvYWQoaW1hZ2UpO1xuICAgIGltYWdlLm9uZXJyb3IgPSAoKSA9PiBvbkVycm9yO1xuICAgIGltYWdlLnNyYyA9IHVybDtcbiAgfSk7XG59O1xuXG5leHBvcnQgZGVmYXVsdCBsb2FkSW1hZ2U7XG4iLCJpbXBvcnQgYWRhcHQgZnJvbSAnLi9kYXRhL2RhdGEtYWRhcHRlcic7XG5pbXBvcnQgbG9hZEltYWdlIGZyb20gJy4vbGliL2xvYWQtaW1hZ2UnO1xuXG5jb25zdCBTRVJWRVJfVVJMID0gYGh0dHBzOi8vZXMuZHVtcC5hY2FkZW15L3BpeGVsLWh1bnRlcmA7XG5jb25zdCBERUZBVUxUX05BTUUgPSBga3ZlemFsYDtcblxuY2xhc3MgTG9hZGVyIHtcbiAgc3RhdGljIGxvYWREYXRhKCkge1xuICAgIHJldHVybiBmZXRjaChgJHtTRVJWRVJfVVJMfS9xdWVzdGlvbnNgKS5cbiAgICAgICAgdGhlbigocmVzcG9uc2UpID0+IHtcbiAgICAgICAgICBpZiAocmVzcG9uc2Uub2spIHtcbiAgICAgICAgICAgIHJldHVybiByZXNwb25zZS5qc29uKCk7XG4gICAgICAgICAgfVxuICAgICAgICAgIHRocm93IG5ldyBFcnJvcihg0J3QtSDRg9C00LDQu9C+0YHRjCDQt9Cw0LPRgNGD0LfQuNGC0Ywg0LTQsNC90L3Ri9C1INGBINGB0LXRgNCy0LXRgNCwYCk7XG4gICAgICAgIH0pXG4gICAgICAgIC50aGVuKGFkYXB0KTtcbiAgfVxuXG4gIHN0YXRpYyBzYXZlUmVzdWx0KGRhdGEsIG5hbWUgPSBERUZBVUxUX05BTUUpIHtcbiAgICBjb25zdCByZXF1ZXN0U2V0dGluZ3MgPSB7XG4gICAgICBib2R5OiBKU09OLnN0cmluZ2lmeShkYXRhKSxcbiAgICAgIGhlYWRlcnM6IHtcbiAgICAgICAgJ0NvbnRlbnQtVHlwZSc6IGBhcHBsaWNhdGlvbi9qc29uYFxuICAgICAgfSxcbiAgICAgIG1ldGhvZDogYFBPU1RgXG4gICAgfTtcblxuICAgIHJldHVybiBmZXRjaChgJHtTRVJWRVJfVVJMfS9zdGF0cy8ke25hbWV9YCwgcmVxdWVzdFNldHRpbmdzKTtcbiAgfVxuXG4gIHN0YXRpYyBsb2FkUmVzdWx0KG5hbWUgPSBERUZBVUxUX05BTUUpIHtcbiAgICByZXR1cm4gZmV0Y2goYCR7U0VSVkVSX1VSTH0vc3RhdHMvJHtuYW1lfWApLlxuICAgICAgICB0aGVuKChyZXNwb25zZSkgPT4ge1xuICAgICAgICAgIGlmIChyZXNwb25zZS5vaykge1xuICAgICAgICAgICAgcmV0dXJuIHJlc3BvbnNlLmpzb24oKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGDQndC1INGD0LTQsNC70L7RgdGMINC30LDQs9GA0YPQt9C40YLRjCDQtNCw0L3QvdGL0LUg0YEg0YHQtdGA0LLQtdGA0LBgKTtcbiAgICAgICAgfSk7XG4gIH1cblxuICBzdGF0aWMgbG9hZEZpbGUoZGF0YSkge1xuICAgIGNvbnN0IExpc3RPZlVSTEltYWdlcyA9IG5ldyBTZXQoKTtcblxuICAgIGRhdGEuZm9yRWFjaCgoaXRlbSkgPT4ge1xuICAgICAgaWYgKGl0ZW0udHlwZSA9PT0gYHNlY29uZGApIHtcbiAgICAgICAgTGlzdE9mVVJMSW1hZ2VzLmFkZChpdGVtLmltYWdlLnVybCk7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgaXRlbS5pbWFnZXMuZm9yRWFjaCgoaW1hZ2UpID0+IHtcbiAgICAgICAgTGlzdE9mVVJMSW1hZ2VzLmFkZChpbWFnZS51cmwpO1xuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICByZXR1cm4gUHJvbWlzZS5hbGwoWy4uLkxpc3RPZlVSTEltYWdlc10ubWFwKChpdGVtKSA9PiBsb2FkSW1hZ2UoaXRlbSkpKTtcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBMb2FkZXI7XG4iLCJpbXBvcnQgQWJzdHJhY3RWaWV3IGZyb20gJy4uL3ZpZXdzL2Fic3RyYWN0LXZpZXcnO1xuaW1wb3J0IFV0aWxzIGZyb20gJy4uL2xpYi91dGlscyc7XG5cbmNsYXNzIEVycm9yU2NyZWVuIGV4dGVuZHMgQWJzdHJhY3RWaWV3IHtcbiAgY29uc3RydWN0b3IobWVzc2FnZSkge1xuICAgIHN1cGVyKCk7XG5cbiAgICB0aGlzLm1lc3NhZ2UgPSBtZXNzYWdlO1xuICB9XG5cbiAgZ2V0IHRlbXBsYXRlKCkge1xuICAgIHJldHVybiAoXG4gICAgICBgPGRpdiBjbGFzcz1cImVycm9yLW1lc3NhZ2VcIj4ke3RoaXMubWVzc2FnZX08L2Rpdj5gXG4gICAgKTtcbiAgfVxuXG4gIHN0YXRpYyBzaG93KG1lc3NhZ2UpIHtcbiAgICBjb25zdCBlcnJvciA9IG5ldyBFcnJvclNjcmVlbihtZXNzYWdlKTtcbiAgICBVdGlscy5kaXNwbGF5RWxlbWVudChlcnJvci5lbGVtZW50LCBkb2N1bWVudC5ib2R5LCB0cnVlKTtcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBFcnJvclNjcmVlbjtcbiIsImltcG9ydCBBYnN0cmFjdFZpZXcgZnJvbSAnLi4vdmlld3MvYWJzdHJhY3Qtdmlldyc7XG5pbXBvcnQgVXRpbHMgZnJvbSAnLi4vbGliL3V0aWxzJztcblxuY2xhc3MgU3BsYXNoU2NyZWVuIGV4dGVuZHMgQWJzdHJhY3RWaWV3IHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgc3VwZXIoKTtcbiAgfVxuXG4gIGdldCB0ZW1wbGF0ZSgpIHtcbiAgICByZXR1cm4gKFxuICAgICAgYDxzdmcgeG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiIGNsYXNzPVwic3BsYXNoXCIgdmlld0JveD1cIjAgMCA3ODAgNzgwXCI+XG4gICAgICAgICAgPGNpcmNsZVxuICAgICAgICAgICAgY3g9XCIzOTBcIiBjeT1cIjM5MFwiIHI9XCI2MFwiXG4gICAgICAgICAgICBjbGFzcz1cInNwbGFzaC1saW5lXCJcbiAgICAgICAgICAgIHN0eWxlPVwidHJhbnNmb3JtOiByb3RhdGUoLTkwZGVnKTsgdHJhbnNmb3JtLW9yaWdpbjogY2VudGVyXCI+PC9jaXJjbGU+XG4gICAgICAgIDwvc3ZnPmBcbiAgICApO1xuICB9XG5cbiAgc3RhcnQoKSB7XG4gICAgVXRpbHMuZGlzcGxheVNjcmVlbih0aGlzLmVsZW1lbnQpO1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IG5ldyBTcGxhc2hTY3JlZW4oKTtcbiIsImltcG9ydCBncmVldGluZ1NjcmVlbiBmcm9tICcuL3NjcmVlbnMvZ3JlZXRpbmctc2NyZWVuJztcbmltcG9ydCBydWxlc1NjcmVlbiBmcm9tICcuL3NjcmVlbnMvcnVsZXMtc2NyZWVuJztcbmltcG9ydCBHYW1lU2NyZWVuIGZyb20gJy4vc2NyZWVucy9nYW1lLXNjcmVlbic7XG5pbXBvcnQgcmVzdWx0U2NyZWVuIGZyb20gJy4vc2NyZWVucy9yZXN1bHQtc2NyZWVuJztcbmltcG9ydCBMb2FkZXIgZnJvbSAnLi9sb2FkZXInO1xuaW1wb3J0IGVycm9yIGZyb20gJy4vc2NyZWVucy9lcnJvci1zY3JlZW4nO1xuaW1wb3J0IHNwbGFzaCBmcm9tICcuL3NjcmVlbnMvc3BsYXNoLXNjcmVlbic7XG5cbmNvbnN0IENvbnRyYWxsZXJJZCA9IHtcbiAgR1JFRVRJTkc6IGBgLFxuICBSVUxFUzogYHJ1bGVzYCxcbiAgR0FNRTogYGdhbWVgLFxuICBTVEFUUzogYHN0YXRzYFxufTtcblxuY2xhc3MgQXBwbGljYXRpb24ge1xuICBzdGF0aWMgaW5pdChpbWFnZXMpIHtcbiAgICBBcHBsaWNhdGlvbi5yb3V0ZXMgPSB7XG4gICAgICBbQ29udHJhbGxlcklkLkdSRUVUSU5HXTogZ3JlZXRpbmdTY3JlZW4sXG4gICAgICBbQ29udHJhbGxlcklkLlJVTEVTXTogcnVsZXNTY3JlZW4sXG4gICAgICBbQ29udHJhbGxlcklkLkdBTUVdOiBuZXcgR2FtZVNjcmVlbihxdWVzdCwgaW1hZ2VzKSxcbiAgICAgIFtDb250cmFsbGVySWQuUkVTVUxUXTogcmVzdWx0U2NyZWVuXG4gICAgfTtcbiAgICBBcHBsaWNhdGlvbi5zaG93R3JlZXRpbmdTY3JlZW4oKTtcbiAgfVxuXG4gIHN0YXRpYyBzaG93R3JlZXRpbmdTY3JlZW4oKSB7XG4gICAgdGhpcy5yb3V0ZXNbQ29udHJhbGxlcklkLkdSRUVUSU5HXS5pbml0KCk7XG4gIH1cblxuICBzdGF0aWMgc2hvd1J1bGVzU2NyZWVuKCkge1xuICAgIHRoaXMucm91dGVzW0NvbnRyYWxsZXJJZC5SVUxFU10uaW5pdCgpO1xuICB9XG5cbiAgc3RhdGljIHNob3dHYW1lU2NyZWVuKHN0YXRlKSB7XG4gICAgdGhpcy5yb3V0ZXNbQ29udHJhbGxlcklkLkdBTUVdLmluaXQoc3RhdGUpO1xuICB9XG5cbiAgc3RhdGljIHNob3dTdGF0c1NjcmVlbihzdGF0ZSkge1xuICAgIHNwbGFzaC5zdGFydCgpO1xuICAgIExvYWRlci5zYXZlUmVzdWx0KHN0YXRlLCBzdGF0ZS5uYW1lKS5cbiAgICAgICAgdGhlbigoKSA9PiBMb2FkZXIubG9hZFJlc3VsdChzdGF0ZS5uYW1lKSkuXG4gICAgICAgIHRoZW4odGhpcy5yb3V0ZXNbQ29udHJhbGxlcklkLlJFU1VMVF0uaW5pdCk7XG4gIH1cbn1cblxubGV0IHF1ZXN0ID0ge307XG5cbmNvbnN0IGxvYWRGaWxlID0gKGRhdGEpID0+IHtcbiAgcXVlc3QgPSBkYXRhO1xuICByZXR1cm4gTG9hZGVyLmxvYWRGaWxlKGRhdGEpO1xufTtcblxuTG9hZGVyLmxvYWREYXRhKClcbiAgICAudGhlbihsb2FkRmlsZSlcbiAgICAudGhlbihBcHBsaWNhdGlvbi5pbml0KVxuICAgIC5jYXRjaChlcnJvci5zaG93KTtcblxuZXhwb3J0IGRlZmF1bHQgQXBwbGljYXRpb247XG4iXSwibmFtZXMiOlsiQXBwIiwiSU1BR0VfUEFSQU1FVEVSUyIsIlR5cGVPZkxldmVscyIsImVycm9yIl0sIm1hcHBpbmdzIjoiOzs7QUFBQSxNQUFNLFlBQVksR0FBRztFQUNuQixLQUFLLEVBQUUsQ0FBQztFQUNSLElBQUksRUFBRSxFQUFFO0VBQ1IsS0FBSyxFQUFFLENBQUM7Q0FDVCxDQUFDOztBQUVGLE1BQU0sY0FBYyxHQUFHO0VBQ3JCLGVBQWUsRUFBRSxDQUFDO0VBQ2xCLGNBQWMsRUFBRSxDQUFDO0VBQ2pCLGNBQWMsRUFBRSxFQUFFO0VBQ2xCLDZCQUE2QixFQUFFLElBQUk7Q0FDcEMsQ0FBQzs7QUFFRixNQUFNLFlBQVksR0FBRztFQUNuQixjQUFjLEVBQUUsR0FBRztFQUNuQixxQkFBcUIsRUFBRSxFQUFFO0VBQ3pCLHFCQUFxQixFQUFFLENBQUMsRUFBRTtFQUMxQixvQkFBb0IsRUFBRSxFQUFFO0NBQ3pCOztBQ2hCRCxNQUFNLElBQUksR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQzs7QUFFaEQsTUFBTSxLQUFLLENBQUM7RUFDVixPQUFPLHNCQUFzQixDQUFDLE1BQU0sRUFBRTtJQUNwQyxNQUFNLFFBQVEsR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQztJQUNwRCxRQUFRLENBQUMsU0FBUyxHQUFHLE1BQU0sQ0FBQztJQUM1QixPQUFPLFFBQVEsQ0FBQyxPQUFPLENBQUM7R0FDekI7O0VBRUQsT0FBTyxZQUFZLENBQUMsTUFBTSxFQUFFO0lBQzFCLE9BQU8sTUFBTSxDQUFDLFVBQVUsRUFBRTtNQUN4QixNQUFNLENBQUMsV0FBVyxDQUFDLE1BQU0sQ0FBQyxVQUFVLENBQUMsQ0FBQztLQUN2QztHQUNGOztFQUVELE9BQU8sY0FBYyxDQUFDLFVBQVUsRUFBRSxNQUFNLEVBQUUsS0FBSyxHQUFHLEtBQUssRUFBRTtJQUN2RCxJQUFJLEtBQUssRUFBRTtNQUNULElBQUksQ0FBQyxZQUFZLENBQUMsTUFBTSxDQUFDLENBQUM7S0FDM0I7SUFDRCxJQUFJLE1BQU0sQ0FBQyxpQkFBaUIsRUFBRTtNQUM1QixNQUFNLENBQUMsWUFBWSxDQUFDLFVBQVUsRUFBRSxNQUFNLENBQUMsaUJBQWlCLENBQUMsQ0FBQztNQUMxRCxPQUFPO0tBQ1I7SUFDRCxNQUFNLENBQUMsV0FBVyxDQUFDLFVBQVUsQ0FBQyxDQUFDO0dBQ2hDOztFQUVELE9BQU8sYUFBYSxDQUFDLFVBQVUsRUFBRTtJQUMvQixJQUFJLENBQUMsY0FBYyxDQUFDLFVBQVUsRUFBRSxJQUFJLEVBQUUsSUFBSSxDQUFDLENBQUM7R0FDN0M7O0VBRUQsT0FBTyxRQUFRLENBQUMsS0FBSyxFQUFFLElBQUksRUFBRTtJQUMzQixPQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztHQUNwQjs7RUFFRCxPQUFPLFFBQVEsQ0FBQyxXQUFXLEVBQUU7SUFDM0IsTUFBTSxLQUFLLEdBQUcsQ0FBQyxDQUFDLGtCQUFrQixDQUFDLENBQUMsQ0FBQztJQUNyQyxXQUFXLENBQUMsT0FBTyxDQUFDLENBQUMsSUFBSSxLQUFLO01BQzVCLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQyx3Q0FBd0MsRUFBRSxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQztLQUN0RSxDQUFDLENBQUM7O0lBRUgsTUFBTSxvQkFBb0IsR0FBRyxjQUFjLENBQUMsY0FBYyxHQUFHLFdBQVcsQ0FBQyxNQUFNLENBQUM7SUFDaEYsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLG9CQUFvQixFQUFFLENBQUMsRUFBRSxFQUFFO01BQzdDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQyxzREFBc0QsQ0FBQyxDQUFDLENBQUM7S0FDdEU7SUFDRCxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztJQUNwQixPQUFPLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0dBQ3hCOztFQUVELE9BQU8sYUFBYSxDQUFDLE1BQU0sRUFBRSxNQUFNLEVBQUU7SUFDbkMsT0FBTyxNQUFNLEdBQUcsTUFBTSxDQUFDO0dBQ3hCOztFQUVELE9BQU8sTUFBTSxDQUFDLEtBQUssRUFBRSxpQkFBaUIsRUFBRTtJQUN0QyxNQUFNLFVBQVUsR0FBRyxLQUFLLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQyxNQUFNLENBQUM7O0lBRTlDLElBQUksUUFBUSxHQUFHLGlCQUFpQixDQUFDLEtBQUssQ0FBQztJQUN2QyxJQUFJLFNBQVMsR0FBRyxRQUFRLEdBQUcsVUFBVSxDQUFDO0lBQ3RDLElBQUksU0FBUyxJQUFJLGlCQUFpQixDQUFDLE1BQU0sRUFBRTtNQUN6QyxPQUFPO1FBQ0wsS0FBSyxFQUFFLFFBQVE7UUFDZixNQUFNLEVBQUUsU0FBUztPQUNsQixDQUFDO0tBQ0g7O0lBRUQsU0FBUyxHQUFHLGlCQUFpQixDQUFDLE1BQU0sQ0FBQztJQUNyQyxRQUFRLEdBQUcsU0FBUyxHQUFHLFVBQVUsQ0FBQztJQUNsQyxPQUFPO01BQ0wsS0FBSyxFQUFFLFFBQVE7TUFDZixNQUFNLEVBQUUsU0FBUztLQUNsQixDQUFDO0dBQ0g7O0VBRUQsT0FBTyxrQkFBa0IsQ0FBQyxNQUFNLEVBQUUsR0FBRyxFQUFFO0lBQ3JDLE1BQU0sV0FBVyxHQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxLQUFLLEtBQUssS0FBSyxDQUFDLEdBQUcsS0FBSyxHQUFHLENBQUMsQ0FBQztJQUM5RCxPQUFPO01BQ0wsS0FBSyxFQUFFLFdBQVcsQ0FBQyxLQUFLO01BQ3hCLE1BQU0sRUFBRSxXQUFXLENBQUMsTUFBTTtLQUMzQixDQUFDO0dBQ0g7Q0FDRjs7QUMvRUQsTUFBTSxZQUFZLENBQUM7RUFDakIsSUFBSSxRQUFRLEdBQUc7SUFDYixNQUFNLElBQUksS0FBSyxDQUFDLENBQUMscUNBQXFDLENBQUMsQ0FBQyxDQUFDO0dBQzFEOztFQUVELElBQUksT0FBTyxHQUFHO0lBQ1osSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUU7TUFDbEIsSUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUM7S0FDL0I7SUFDRCxNQUFNLE9BQU8sR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUM5QyxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO0lBQ25CLE9BQU8sT0FBTyxDQUFDO0dBQ2hCOztFQUVELElBQUksR0FBRzs7R0FFTjs7RUFFRCxNQUFNLEdBQUc7SUFDUCxPQUFPLEtBQUssQ0FBQyxzQkFBc0IsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7R0FDcEQ7O0NBRUY7O0FDdEJELE1BQU0sWUFBWSxTQUFTLFlBQVksQ0FBQztFQUN0QyxXQUFXLEdBQUc7SUFDWixLQUFLLEVBQUUsQ0FBQztHQUNUOztFQUVELElBQUksUUFBUSxHQUFHO0lBQ2I7TUFDRSxDQUFDOzs7Ozs7Ozs7Ozs7WUFZSyxDQUFDO01BQ1A7R0FDSDs7RUFFRCxJQUFJLENBQUMsT0FBTyxFQUFFO0lBQ1osTUFBTSxjQUFjLEdBQUcsT0FBTyxDQUFDLGFBQWEsQ0FBQyxDQUFDLG1CQUFtQixDQUFDLENBQUMsQ0FBQztJQUNwRSxjQUFjLENBQUMsT0FBTyxHQUFHLENBQUMsR0FBRyxLQUFLLElBQUksQ0FBQyxlQUFlLENBQUMsR0FBRyxDQUFDLENBQUM7O0lBRTVELE1BQU0sUUFBUSxHQUFHLE9BQU8sQ0FBQyxhQUFhLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDO0lBQ3BELE1BQU0sQ0FBQyxVQUFVLENBQUMsTUFBTTtNQUN0QixRQUFRLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQUM7S0FDekMsRUFBRSxFQUFFLENBQUMsQ0FBQztHQUNSO0NBQ0Y7O0FDOUJELE1BQU0sY0FBYyxDQUFDO0VBQ25CLFdBQVcsR0FBRztJQUNaLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxZQUFZLEVBQUUsQ0FBQztHQUNoQzs7RUFFRCxJQUFJLEdBQUc7SUFDTCxJQUFJLENBQUMsSUFBSSxDQUFDLGVBQWUsR0FBRyxNQUFNO01BQ2hDQSxXQUFHLENBQUMsZUFBZSxFQUFFLENBQUM7S0FDdkIsQ0FBQzs7SUFFRixLQUFLLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7R0FDeEM7Q0FDRjs7QUFFRCxxQkFBZSxJQUFJLGNBQWMsRUFBRSxDQUFDOztBQ2ZwQyxNQUFNLGdCQUFnQixHQUFHO0VBQ3ZCLEtBQUssRUFBRSxHQUFHO0VBQ1YsTUFBTSxFQUFFLEdBQUc7Q0FDWixDQUFDOztBQUVGLE1BQU0sa0JBQWtCLFNBQVMsWUFBWSxDQUFDO0VBQzVDLFdBQVcsQ0FBQyxRQUFRLEVBQUU7SUFDcEIsS0FBSyxFQUFFLENBQUM7O0lBRVIsSUFBSSxDQUFDLGFBQWEsR0FBRyxRQUFRLENBQUMsY0FBYyxDQUFDLGFBQWEsQ0FBQztJQUMzRCxJQUFJLENBQUMsWUFBWSxHQUFHLFFBQVEsQ0FBQyxLQUFLLENBQUMsWUFBWSxDQUFDO0lBQ2hELElBQUksQ0FBQyxZQUFZLEdBQUcsUUFBUSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUM7R0FDckU7O0VBRUQsSUFBSSxRQUFRLEdBQUc7SUFDYjtNQUNFLENBQUMsc0JBQXNCLEVBQUUsSUFBSSxDQUFDLFlBQVksQ0FBQyxRQUFRLENBQUM7O1FBRWxELEVBQUUsSUFBSSxDQUFDLG1CQUFtQixDQUFDO2FBQ3RCLENBQUM7TUFDUjtHQUNIOztFQUVELGNBQWMsQ0FBQyxHQUFHLEVBQUUsS0FBSyxFQUFFO0lBQ3pCLE1BQU0sZUFBZSxHQUFHLEtBQUssQ0FBQyxrQkFBa0IsQ0FBQyxJQUFJLENBQUMsWUFBWSxFQUFFLEdBQUcsQ0FBQyxDQUFDO0lBQ3pFLE1BQU0sa0JBQWtCLEdBQUcsS0FBSyxDQUFDLE1BQU0sQ0FBQyxlQUFlLEVBQUUsZ0JBQWdCLENBQUMsQ0FBQzs7SUFFM0U7TUFDRSxDQUFDO2tCQUNXLEVBQUUsR0FBRyxDQUFDLGNBQWMsRUFBRSxLQUFLLEdBQUcsQ0FBQyxDQUFDLFNBQVMsRUFBRSxrQkFBa0IsQ0FBQyxLQUFLLENBQUMsVUFBVSxFQUFFLGtCQUFrQixDQUFDLE1BQU0sQ0FBQzs7K0JBRTdGLEVBQUUsS0FBSyxHQUFHLENBQUMsQ0FBQzs7OzsrQkFJWixFQUFFLEtBQUssR0FBRyxDQUFDLENBQUM7OztZQUcvQixDQUFDO01BQ1A7R0FDSDs7RUFFRCxJQUFJLG1CQUFtQixHQUFHO0lBQ3hCLE9BQU8sSUFBSSxDQUFDLFlBQVksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxFQUFFLEtBQUssS0FBSztNQUNuRCxPQUFPLElBQUksQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLEdBQUcsRUFBRSxLQUFLLENBQUMsQ0FBQztLQUM3QyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztHQUNkOztFQUVELElBQUksQ0FBQyxPQUFPLEVBQUU7SUFDWixNQUFNLElBQUksR0FBRyxPQUFPLENBQUMsYUFBYSxDQUFDLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQzs7SUFFckQsTUFBTSxZQUFZLEdBQUcsSUFBSSxDQUFDLGdCQUFnQixDQUFDLENBQUMsbUJBQW1CLENBQUMsQ0FBQyxDQUFDO0lBQ2xFLENBQUMsR0FBRyxZQUFZLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxLQUFLLEtBQUs7TUFDbkMsS0FBSyxDQUFDLFFBQVEsR0FBRyxDQUFDLEdBQUcsS0FBSyxJQUFJLENBQUMsYUFBYSxDQUFDLEdBQUcsRUFBRSxJQUFJLENBQUMsQ0FBQztLQUN6RCxDQUFDLENBQUM7R0FDSjtDQUNGOztBQ3hERCxNQUFNQyxrQkFBZ0IsR0FBRztFQUN2QixLQUFLLEVBQUUsR0FBRztFQUNWLE1BQU0sRUFBRSxHQUFHO0NBQ1osQ0FBQzs7QUFFRixNQUFNLG1CQUFtQixTQUFTLFlBQVksQ0FBQztFQUM3QyxXQUFXLENBQUMsUUFBUSxFQUFFO0lBQ3BCLEtBQUssRUFBRSxDQUFDOztJQUVSLElBQUksQ0FBQyxhQUFhLEdBQUcsUUFBUSxDQUFDLGVBQWUsQ0FBQyxhQUFhLENBQUM7SUFDNUQsSUFBSSxDQUFDLFlBQVksR0FBRyxRQUFRLENBQUMsS0FBSyxDQUFDLFlBQVksQ0FBQztJQUNoRCxJQUFJLENBQUMsWUFBWSxHQUFHLFFBQVEsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDO0dBQ3JFOztFQUVELElBQUksUUFBUSxHQUFHO0lBQ2IsTUFBTSxlQUFlLEdBQUcsS0FBSyxDQUFDLGtCQUFrQixDQUFDLElBQUksQ0FBQyxZQUFZO1FBQzlELElBQUksQ0FBQyxZQUFZLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBQ2pDLE1BQU0sa0JBQWtCLEdBQUcsS0FBSyxDQUFDLE1BQU0sQ0FBQyxlQUFlLEVBQUVBLGtCQUFnQixDQUFDLENBQUM7O0lBRTNFO01BQ0UsQ0FBQzs7O29CQUdhLEVBQUUsSUFBSSxDQUFDLFlBQVksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLHdCQUF3QixFQUFFLGtCQUFrQixDQUFDLEtBQUssQ0FBQyxVQUFVLEVBQUUsa0JBQWtCLENBQUMsTUFBTSxDQUFDOzs7Ozs7Ozs7O2FBVTlILENBQUM7TUFDUjtHQUNIOztFQUVELElBQUksQ0FBQyxPQUFPLEVBQUU7SUFDWixNQUFNLFlBQVksR0FBRyxPQUFPLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDLENBQUM7SUFDckUsQ0FBQyxHQUFHLFlBQVksQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLEtBQUssS0FBSztNQUNuQyxLQUFLLENBQUMsT0FBTyxHQUFHLENBQUMsR0FBRyxLQUFLLElBQUksQ0FBQyxhQUFhLENBQUMsR0FBRyxFQUFFLENBQUMsR0FBRyxZQUFZLENBQUMsQ0FBQyxDQUFDO0tBQ3JFLENBQUMsQ0FBQztHQUNKO0NBQ0Y7O0FDM0NELE1BQU1BLGtCQUFnQixHQUFHO0VBQ3ZCLEtBQUssRUFBRSxHQUFHO0VBQ1YsTUFBTSxFQUFFLEdBQUc7Q0FDWixDQUFDOztBQUVGLE1BQU0sa0JBQWtCLFNBQVMsWUFBWSxDQUFDO0VBQzVDLFdBQVcsQ0FBQyxRQUFRLEVBQUU7SUFDcEIsS0FBSyxFQUFFLENBQUM7O0lBRVIsSUFBSSxDQUFDLGFBQWEsR0FBRyxRQUFRLENBQUMsY0FBYyxDQUFDLGFBQWEsQ0FBQztJQUMzRCxJQUFJLENBQUMsWUFBWSxHQUFHLFFBQVEsQ0FBQyxLQUFLLENBQUMsWUFBWSxDQUFDO0lBQ2hELElBQUksQ0FBQyxZQUFZLEdBQUcsUUFBUSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUM7R0FDckU7O0VBRUQsSUFBSSxRQUFRLEdBQUc7SUFDYjtNQUNFLENBQUMsc0JBQXNCLEVBQUUsSUFBSSxDQUFDLFlBQVksQ0FBQyxRQUFRLENBQUM7O1FBRWxELEVBQUUsSUFBSSxDQUFDLG1CQUFtQixDQUFDO2FBQ3RCLENBQUM7TUFDUjtHQUNIOztFQUVELGNBQWMsQ0FBQyxHQUFHLEVBQUUsS0FBSyxFQUFFO0lBQ3pCLE1BQU0sZUFBZSxHQUFHLEtBQUssQ0FBQyxrQkFBa0IsQ0FBQyxJQUFJLENBQUMsWUFBWSxFQUFFLEdBQUcsQ0FBQyxDQUFDO0lBQ3pFLE1BQU0sa0JBQWtCLEdBQUcsS0FBSyxDQUFDLE1BQU0sQ0FBQyxlQUFlLEVBQUVBLGtCQUFnQixDQUFDLENBQUM7O0lBRTNFO01BQ0UsQ0FBQztrQkFDVyxFQUFFLEdBQUcsQ0FBQyxjQUFjLEVBQUUsS0FBSyxHQUFHLENBQUMsQ0FBQyxTQUFTLEVBQUUsa0JBQWtCLENBQUMsS0FBSyxDQUFDLFVBQVUsRUFBRSxrQkFBa0IsQ0FBQyxNQUFNLENBQUM7WUFDaEgsQ0FBQztNQUNQO0dBQ0g7O0VBRUQsSUFBSSxtQkFBbUIsR0FBRztJQUN4QixPQUFPLElBQUksQ0FBQyxZQUFZLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksRUFBRSxLQUFLLEtBQUs7TUFDbkQsT0FBTyxJQUFJLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxHQUFHLEVBQUUsS0FBSyxDQUFDLENBQUM7S0FDN0MsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7R0FDZDs7RUFFRCxJQUFJLENBQUMsT0FBTyxFQUFFO0lBQ1osTUFBTSxPQUFPLEdBQUcsT0FBTyxDQUFDLGdCQUFnQixDQUFDLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQztJQUMxRCxDQUFDLEdBQUcsT0FBTyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsTUFBTSxLQUFLO01BQy9CLE1BQU0sQ0FBQyxPQUFPLEdBQUcsQ0FBQyxHQUFHLEtBQUssSUFBSSxDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQUMsQ0FBQztLQUNuRCxDQUFDLENBQUM7R0FDSjtDQUNGOztBQzFDRCxNQUFNLFlBQVksR0FBRztFQUNuQixLQUFLLEVBQUUsQ0FBQyxLQUFLLENBQUM7RUFDZCxNQUFNLEVBQUUsQ0FBQyxNQUFNLENBQUM7RUFDaEIsS0FBSyxFQUFFLENBQUMsS0FBSyxDQUFDO0NBQ2YsQ0FBQzs7QUFFRixNQUFNLFdBQVcsR0FBRztFQUNsQixDQUFDLFlBQVksQ0FBQyxLQUFLLEdBQUcsa0JBQWtCO0VBQ3hDLENBQUMsWUFBWSxDQUFDLE1BQU0sR0FBRyxtQkFBbUI7RUFDMUMsQ0FBQyxZQUFZLENBQUMsS0FBSyxHQUFHLGtCQUFrQjtDQUN6QyxDQUFDOztBQUVGLE1BQU0sUUFBUSxTQUFTLFlBQVksQ0FBQztFQUNsQyxXQUFXLENBQUMsS0FBSyxFQUFFO0lBQ2pCLEtBQUssRUFBRSxDQUFDO0lBQ1IsSUFBSSxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUM7R0FDcEI7O0VBRUQsSUFBSSxRQUFRLEdBQUc7SUFDYjtNQUNFLENBQUM7OztVQUdHLEVBQUUsS0FBSyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQzs7WUFFekMsQ0FBQztNQUNQO0dBQ0g7O0VBRUQsSUFBSSxDQUFDLE9BQU8sRUFBRTtJQUNaLElBQUksQ0FBQyxNQUFNLEdBQUcsT0FBTyxDQUFDLGFBQWEsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7SUFDL0MsYUFBYSxDQUFDLElBQUksQ0FBQyxDQUFDOztJQUVwQixJQUFJLENBQUMsY0FBYyxHQUFHLE9BQU8sQ0FBQyxhQUFhLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO0lBQ3JELElBQUksQ0FBQyxXQUFXLEVBQUUsQ0FBQztHQUNwQjs7RUFFRCxXQUFXLEdBQUc7SUFDWixNQUFNLGdCQUFnQixHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQztJQUN0RCxNQUFNLEtBQUssR0FBRyxJQUFJLFdBQVcsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLE9BQU8sQ0FBQztJQUM5RCxLQUFLLENBQUMsY0FBYyxDQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsY0FBYyxDQUFDLENBQUM7R0FDbEQ7Q0FDRjs7QUM3Q0QsTUFBTSxVQUFVLFNBQVMsWUFBWSxDQUFDO0VBQ3BDLFdBQVcsQ0FBQyxJQUFJLEVBQUU7SUFDaEIsS0FBSyxFQUFFLENBQUM7O0lBRVIsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUM7SUFDakIsSUFBSSxDQUFDLGlCQUFpQixHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsaUJBQWlCLENBQUM7R0FDeEQ7O0VBRUQsSUFBSSxRQUFRLEdBQUc7SUFDYjtNQUNFLENBQUM7Ozs7OztNQU1ELEVBQUUsSUFBSSxDQUFDLGFBQWEsQ0FBQztNQUNyQixFQUFFLElBQUksQ0FBQyxhQUFhLENBQUMsQ0FBQztNQUN0QjtHQUNIOztFQUVELElBQUksYUFBYSxHQUFHO0lBQ2xCLElBQUksRUFBRSxJQUFJLENBQUMsSUFBSSxZQUFZLFFBQVEsQ0FBQyxFQUFFO01BQ3BDLE9BQU8sQ0FBQyxDQUFDLENBQUM7S0FDWDtJQUNELE9BQU8sQ0FBQywrQkFBK0IsQ0FBQyxDQUFDO0dBQzFDOztFQUVELElBQUksYUFBYSxHQUFHO0lBQ2xCLElBQUksRUFBRSxJQUFJLENBQUMsSUFBSSxZQUFZLFFBQVEsQ0FBQyxFQUFFO01BQ3BDLE9BQU8sQ0FBQyxDQUFDLENBQUM7S0FDWDs7SUFFRCxNQUFNLEtBQUssR0FBRyxFQUFFLENBQUM7SUFDakIsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLFlBQVksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLEtBQUssRUFBRSxDQUFDLEVBQUUsRUFBRTtNQUN6RSxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUMsc0ZBQXNGLENBQUMsQ0FBQyxDQUFDO0tBQ3RHO0lBQ0QsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxLQUFLLEVBQUUsQ0FBQyxFQUFFLEVBQUU7TUFDcEQsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDLHFGQUFxRixDQUFDLENBQUMsQ0FBQztLQUNyRzs7SUFFRCxPQUFPLENBQUMseUJBQXlCLEVBQUUsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUM7R0FDNUQ7O0VBRUQsWUFBWSxHQUFHO0lBQ2IsSUFBSSxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksSUFBSSxDQUFDLEVBQUU7TUFDeEIsSUFBSSxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLENBQUMsdUJBQXVCLENBQUMsQ0FBQyxDQUFDO0tBQ3JEO0lBQ0QsSUFBSSxDQUFDLEtBQUssQ0FBQyxXQUFXLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUM7R0FDMUM7O0VBRUQsSUFBSSxHQUFHO0lBQ0wsSUFBSSxDQUFDLFlBQVksRUFBRSxDQUFDO0lBQ3BCLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxHQUFHLE1BQU0sQ0FBQyxVQUFVLENBQUMsTUFBTTtNQUMzQyxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDOztNQUVsQixJQUFJLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxHQUFHLGNBQWMsQ0FBQyxjQUFjLEVBQUU7UUFDbkQsSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDO1FBQ1osT0FBTztPQUNSO01BQ0QsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxFQUFFLENBQUM7O0tBRXpCLEVBQUUsY0FBYyxDQUFDLDZCQUE2QixDQUFDLENBQUM7R0FDbEQ7O0VBRUQsSUFBSSxDQUFDLE9BQU8sRUFBRTtJQUNaLE1BQU0sVUFBVSxHQUFHLE9BQU8sQ0FBQyxhQUFhLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO0lBQ2xELFVBQVUsQ0FBQyxPQUFPLEdBQUcsQ0FBQyxHQUFHLEtBQUssSUFBSSxDQUFDLGlCQUFpQixDQUFDLEdBQUcsQ0FBQyxDQUFDOztJQUUxRCxNQUFNLEtBQUssR0FBRyxPQUFPLENBQUMsYUFBYSxDQUFDLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQztJQUNwRCxJQUFJLEtBQUssRUFBRTtNQUNULElBQUksQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDO01BQ25CLElBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDO01BQ25DLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQztLQUNiO0dBQ0Y7Q0FDRjs7QUM3RUQsTUFBTSxhQUFhLEdBQUcsQ0FBQyxJQUFJLEtBQUs7RUFDOUIsTUFBTSxNQUFNLEdBQUcsSUFBSSxVQUFVLENBQUMsSUFBSSxDQUFDLENBQUMsT0FBTyxDQUFDO0VBQzVDLEtBQUssQ0FBQyxjQUFjLENBQUMsTUFBTSxFQUFFLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztDQUMzQzs7QUNIRCxNQUFNLFNBQVMsU0FBUyxZQUFZLENBQUM7RUFDbkMsV0FBVyxHQUFHO0lBQ1osS0FBSyxFQUFFLENBQUM7R0FDVDs7RUFFRCxJQUFJLFFBQVEsR0FBRztJQUNiO01BQ0UsQ0FBQzs7Ozs7Ozs7Ozs7Ozs7OztZQWdCSyxDQUFDO01BQ1A7R0FDSDs7RUFFRCxJQUFJLENBQUMsT0FBTyxFQUFFO0lBQ1osSUFBSSxDQUFDLE1BQU0sR0FBRyxPQUFPLENBQUMsYUFBYSxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQztJQUMvQyxhQUFhLENBQUMsSUFBSSxDQUFDLENBQUM7O0lBRXBCLE1BQU0sSUFBSSxHQUFHLE9BQU8sQ0FBQyxhQUFhLENBQUMsQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDO0lBQ25ELElBQUksQ0FBQyxRQUFRLEdBQUcsQ0FBQyxHQUFHLEtBQUssSUFBSSxDQUFDLGlCQUFpQixDQUFDLEdBQUcsQ0FBQyxDQUFDOztJQUVyRCxNQUFNLEtBQUssR0FBRyxPQUFPLENBQUMsYUFBYSxDQUFDLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQztJQUNyRCxLQUFLLENBQUMsT0FBTyxHQUFHLENBQUMsR0FBRyxLQUFLLElBQUksQ0FBQyxZQUFZLENBQUMsR0FBRyxDQUFDLENBQUM7R0FDakQ7Q0FDRjs7QUNyQ0QsTUFBTSxZQUFZLENBQUM7RUFDakIsSUFBSSxDQUFDLFFBQVEsRUFBRTtJQUNiLElBQUksQ0FBQyxpQkFBaUIsR0FBRyxDQUFDLEdBQUcsS0FBSztNQUNoQyxHQUFHLENBQUMsY0FBYyxFQUFFLENBQUM7TUFDckJELFdBQUcsQ0FBQyxrQkFBa0IsRUFBRSxDQUFDO01BQ3pCLElBQUksUUFBUSxFQUFFO1FBQ1osTUFBTSxDQUFDLFlBQVksQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDO09BQzlDO0tBQ0YsQ0FBQzs7SUFFRixJQUFJLENBQUMsUUFBUSxFQUFFO01BQ2IsT0FBTyxJQUFJLENBQUM7S0FDYjs7SUFFRCxNQUFNLFNBQVMsR0FBRyxRQUFRLENBQUMsS0FBSyxDQUFDOztJQUVqQyxJQUFJLENBQUMsSUFBSSxHQUFHLE1BQU07TUFDaEIsSUFBSSxTQUFTLENBQUMsS0FBSyxDQUFDLElBQUksR0FBRyxjQUFjLENBQUMsY0FBYyxFQUFFO1FBQ3hELE9BQU87T0FDUjtNQUNELEVBQUUsU0FBUyxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUM7TUFDeEIsRUFBRSxTQUFTLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQztNQUN4QixTQUFTLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDOztNQUUzQixJQUFJLENBQUMsU0FBUyxDQUFDLFNBQVMsRUFBRSxFQUFFO1FBQzFCQSxXQUFHLENBQUMsZUFBZSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUNyQyxPQUFPO09BQ1I7TUFDREEsV0FBRyxDQUFDLGNBQWMsQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUM7S0FDckMsQ0FBQzs7SUFFRixPQUFPLElBQUksQ0FBQztHQUNiO0NBQ0Y7O0FBRUQsYUFBZSxJQUFJLFlBQVksRUFBRSxDQUFDOztBQ2hDbEMsTUFBTSxjQUFjLEdBQUcsQ0FBQyxDQUFDOztBQUV6QixNQUFNLFdBQVcsQ0FBQztFQUNoQixXQUFXLEdBQUc7SUFDWixJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksU0FBUyxFQUFFLENBQUM7R0FDN0I7O0VBRUQsSUFBSSxHQUFHO0lBQ0wsSUFBSSxDQUFDLElBQUksQ0FBQyxZQUFZLEdBQUcsQ0FBQyxHQUFHLEtBQUs7TUFDaEMsR0FBRyxDQUFDLGNBQWMsRUFBRSxDQUFDO01BQ3JCLE1BQU0sS0FBSyxHQUFHLEdBQUcsQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDOztNQUV0QyxNQUFNLElBQUksR0FBRyxHQUFHLENBQUMsYUFBYSxDQUFDLGFBQWEsQ0FBQztNQUM3QyxNQUFNLFdBQVcsR0FBRyxJQUFJLENBQUMsYUFBYSxDQUFDLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQztNQUN6RCxXQUFXLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQzs7TUFFNUIsSUFBSSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsS0FBSyxDQUFDLEVBQUU7UUFDM0IsT0FBTztPQUNSO01BQ0QsSUFBSSxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUM7TUFDbkIsV0FBVyxDQUFDLFFBQVEsR0FBRyxLQUFLLENBQUM7S0FDOUIsQ0FBQzs7SUFFRixJQUFJLENBQUMsSUFBSSxDQUFDLGlCQUFpQixHQUFHLENBQUMsR0FBRyxLQUFLO01BQ3JDLEdBQUcsQ0FBQyxjQUFjLEVBQUUsQ0FBQzs7TUFFckIsTUFBTSxLQUFLLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQyxFQUFFLEVBQUUsWUFBWSxDQUFDLENBQUM7TUFDOUMsS0FBSyxDQUFDLE9BQU8sR0FBRyxFQUFFLENBQUM7TUFDbkIsS0FBSyxDQUFDLElBQUksR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDOztNQUV4QkEsV0FBRyxDQUFDLGNBQWMsQ0FBQyxLQUFLLENBQUMsQ0FBQztLQUMzQixDQUFDOztJQUVGLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQyxJQUFJLEVBQUUsQ0FBQzs7SUFFakMsS0FBSyxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO0dBQ3hDOztFQUVELFVBQVUsQ0FBQyxLQUFLLEVBQUU7SUFDaEIsTUFBTSxjQUFjLEdBQUcsNkJBQTZCLENBQUM7SUFDckQsTUFBTSxrQkFBa0IsR0FBRyxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7O0lBRXZEO01BQ0UsS0FBSyxDQUFDLE1BQU0sSUFBSSxjQUFjO01BQzlCLGtCQUFrQjtNQUNsQjtHQUNIO0NBQ0Y7O0FBRUQsa0JBQWUsSUFBSSxXQUFXLEVBQUUsQ0FBQzs7QUNwRGpDLE1BQU0sV0FBVyxHQUFHO0VBQ2xCLElBQUksRUFBRSxFQUFFO0VBQ1IsSUFBSSxFQUFFLEVBQUU7Q0FDVCxDQUFDOztBQUVGLE1BQU0sU0FBUyxDQUFDO0VBQ2QsV0FBVyxDQUFDLElBQUksRUFBRSxZQUFZLEVBQUU7SUFDOUIsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUM7SUFDakIsSUFBSSxDQUFDLFlBQVksR0FBRyxZQUFZLENBQUM7R0FDbEM7O0VBRUQsV0FBVyxDQUFDLFFBQVEsRUFBRTtJQUNwQixJQUFJLENBQUMsS0FBSyxHQUFHLFFBQVEsQ0FBQztJQUN0QixJQUFJLENBQUMsVUFBVSxFQUFFLENBQUM7R0FDbkI7O0VBRUQsVUFBVSxHQUFHO0lBQ1gsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLEdBQUcsWUFBWSxDQUFDLElBQUksQ0FBQztHQUNyQzs7RUFFRCxTQUFTLEdBQUc7SUFDVjtNQUNFLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLEdBQUcsY0FBYyxDQUFDLGNBQWM7T0FDaEQsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsTUFBTSxHQUFHLGNBQWMsQ0FBQyxjQUFjLENBQUM7T0FDMUQsSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLElBQUksY0FBYyxDQUFDLGVBQWUsQ0FBQztNQUNwRDtHQUNIOztFQUVELElBQUksWUFBWSxHQUFHO0lBQ2pCLE9BQU8sS0FBSyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7R0FDcEQ7O0VBRUQsT0FBTyxhQUFhLENBQUMsTUFBTSxFQUFFLElBQUksRUFBRTtJQUNqQyxJQUFJLENBQUMsTUFBTSxFQUFFO01BQ1gsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDO0tBQ2hCO0lBQ0QsSUFBSSxJQUFJLEdBQUcsV0FBVyxDQUFDLElBQUksRUFBRTtNQUMzQixPQUFPLENBQUMsSUFBSSxDQUFDLENBQUM7S0FDZjtJQUNELElBQUksSUFBSSxJQUFJLFdBQVcsQ0FBQyxJQUFJLElBQUksSUFBSSxHQUFHLFdBQVcsQ0FBQyxJQUFJLEVBQUU7TUFDdkQsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDO0tBQ2xCO0lBQ0QsSUFBSSxJQUFJLElBQUksV0FBVyxDQUFDLElBQUksSUFBSSxJQUFJLEdBQUcsWUFBWSxDQUFDLElBQUksRUFBRTtNQUN4RCxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUM7S0FDZjtJQUNELE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQztHQUNoQjs7RUFFRCxTQUFTLENBQUMsTUFBTSxFQUFFLElBQUksRUFBRTtJQUN0QixJQUFJLEdBQUcsQ0FBQyxJQUFJLElBQUksRUFBRSxHQUFHLElBQUksSUFBSSxjQUFjLENBQUMsNkJBQTZCLENBQUM7SUFDMUUsTUFBTSxJQUFJLEdBQUcsU0FBUyxDQUFDLGFBQWEsQ0FBQyxNQUFNLEVBQUUsSUFBSSxDQUFDLENBQUM7SUFDbkQsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO0dBQy9CO0NBQ0Y7O0FDeERELE1BQU0sb0JBQW9CLENBQUM7RUFDekIsSUFBSSxDQUFDLFFBQVEsRUFBRTtJQUNiLElBQUksQ0FBQyxTQUFTLEdBQUcsUUFBUSxDQUFDLEtBQUssQ0FBQztJQUNoQyxJQUFJLENBQUMsWUFBWSxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsWUFBWSxDQUFDOztJQUVoRCxJQUFJLENBQUMsYUFBYSxHQUFHLENBQUMsR0FBRyxFQUFFLElBQUksS0FBSztNQUNsQyxHQUFHLENBQUMsY0FBYyxFQUFFLENBQUM7O01BRXJCLE1BQU0sV0FBVyxHQUFHLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQUM7TUFDM0QsSUFBSSxDQUFDLG9CQUFvQixDQUFDLFNBQVMsQ0FBQyxXQUFXLENBQUMsRUFBRTtRQUNoRCxPQUFPO09BQ1I7O01BRUQsTUFBTSxNQUFNLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxXQUFXLENBQUMsQ0FBQztNQUMzQyxRQUFRLENBQUMsY0FBYyxDQUFDLE1BQU0sQ0FBQyxDQUFDO0tBQ2pDLENBQUM7O0lBRUYsT0FBTyxJQUFJLENBQUM7R0FDYjs7RUFFRCxPQUFPLFNBQVMsQ0FBQyxXQUFXLEVBQUU7SUFDNUIsT0FBTyxDQUFDLEdBQUcsV0FBVyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsTUFBTSxLQUFLO01BQ3hDLE1BQU0sV0FBVyxHQUFHLE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDLG1CQUFtQixDQUFDLENBQUMsQ0FBQztNQUNuRSxPQUFPLENBQUMsR0FBRyxXQUFXLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxLQUFLLEtBQUssS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDO0tBQ3hELENBQUMsQ0FBQztHQUNKOztFQUVELFNBQVMsQ0FBQyxXQUFXLEVBQUU7SUFDckIsT0FBTyxDQUFDLEdBQUcsV0FBVyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsTUFBTSxFQUFFLEtBQUssS0FBSztNQUMvQyxNQUFNLFNBQVMsR0FBRyxJQUFJLENBQUMsWUFBWSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQyxJQUFJLENBQUM7TUFDdkQsTUFBTSxXQUFXLEdBQUcsTUFBTSxDQUFDLGdCQUFnQixDQUFDLENBQUMsbUJBQW1CLENBQUMsQ0FBQyxDQUFDOztNQUVuRSxPQUFPLENBQUMsR0FBRyxXQUFXLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxLQUFLLEtBQUs7UUFDdEMsSUFBSSxLQUFLLENBQUMsT0FBTyxFQUFFO1VBQ2pCLE9BQU8sS0FBSyxDQUFDLEtBQUssS0FBSyxTQUFTLENBQUM7U0FDbEM7UUFDRCxPQUFPLEtBQUssQ0FBQztPQUNkLENBQUMsQ0FBQztLQUNKLENBQUMsQ0FBQztHQUNKO0NBQ0Y7O0FBRUQscUJBQWUsSUFBSSxvQkFBb0IsRUFBRSxDQUFDOztBQzFDMUMsTUFBTSxxQkFBcUIsQ0FBQztFQUMxQixJQUFJLENBQUMsUUFBUSxFQUFFO0lBQ2IsTUFBTSxTQUFTLEdBQUcsUUFBUSxDQUFDLEtBQUssQ0FBQztJQUNqQyxJQUFJLENBQUMsWUFBWSxHQUFHLFNBQVMsQ0FBQyxZQUFZLENBQUM7O0lBRTNDLElBQUksQ0FBQyxhQUFhLEdBQUcsQ0FBQyxHQUFHLEtBQUs7TUFDNUIsR0FBRyxDQUFDLGNBQWMsRUFBRSxDQUFDOztNQUVyQixNQUFNLE1BQU0sR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxhQUFhLENBQUMsQ0FBQztNQUNqRCxRQUFRLENBQUMsY0FBYyxDQUFDLE1BQU0sQ0FBQyxDQUFDO0tBQ2pDLENBQUM7O0lBRUYsT0FBTyxJQUFJLENBQUM7R0FDYjs7RUFFRCxTQUFTLENBQUMsS0FBSyxFQUFFO0lBQ2YsTUFBTSxTQUFTLEdBQUcsSUFBSSxDQUFDLFlBQVksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDO0lBQy9DLE9BQU8sS0FBSyxDQUFDLEtBQUssS0FBSyxTQUFTLENBQUM7R0FDbEM7Q0FDRjs7QUFFRCxzQkFBZSxJQUFJLHFCQUFxQixFQUFFLENBQUM7O0FDckIzQyxNQUFNLG9CQUFvQixDQUFDO0VBQ3pCLElBQUksQ0FBQyxRQUFRLEVBQUU7SUFDYixNQUFNLFNBQVMsR0FBRyxRQUFRLENBQUMsS0FBSyxDQUFDO0lBQ2pDLElBQUksQ0FBQyxZQUFZLEdBQUcsU0FBUyxDQUFDLFlBQVksQ0FBQzs7SUFFM0MsSUFBSSxDQUFDLGFBQWEsR0FBRyxDQUFDLEdBQUcsS0FBSztNQUM1QixHQUFHLENBQUMsY0FBYyxFQUFFLENBQUM7O01BRXJCLE1BQU0sTUFBTSxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLGFBQWEsQ0FBQyxDQUFDO01BQ2pELFFBQVEsQ0FBQyxjQUFjLENBQUMsTUFBTSxDQUFDLENBQUM7S0FDakMsQ0FBQzs7SUFFRixPQUFPLElBQUksQ0FBQztHQUNiOztFQUVELFNBQVMsQ0FBQyxNQUFNLEVBQUU7SUFDaEIsTUFBTSxRQUFRLEdBQUcsTUFBTSxDQUFDLGFBQWEsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDO0lBQ2pELE1BQU0sYUFBYSxHQUFHLElBQUksQ0FBQyxZQUFZLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLEtBQUssS0FBSztNQUM3RCxPQUFPLEtBQUssQ0FBQyxHQUFHLEtBQUssUUFBUSxDQUFDO0tBQy9CLENBQUMsQ0FBQztJQUNILE9BQU8sYUFBYSxDQUFDLElBQUksS0FBSyxJQUFJLENBQUMsWUFBWSxDQUFDLE1BQU0sQ0FBQztHQUN4RDtDQUNGOztBQUVELHFCQUFlLElBQUksb0JBQW9CLEVBQUUsQ0FBQzs7QUNmMUMsTUFBTSxVQUFVLENBQUM7RUFDZixXQUFXLENBQUMsUUFBUSxFQUFFLFlBQVksRUFBRTtJQUNsQyxJQUFJLENBQUMsS0FBSyxHQUFHLElBQUksU0FBUyxDQUFDLFFBQVEsRUFBRSxZQUFZLENBQUMsQ0FBQztHQUNwRDs7RUFFRCxJQUFJLENBQUMsS0FBSyxFQUFFO0lBQ1YsSUFBSSxDQUFDLEtBQUssQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDOUIsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLFFBQVEsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDckMsTUFBTSxJQUFJLEdBQUcsSUFBSSxJQUFJLEVBQUUsQ0FBQzs7SUFFeEIsSUFBSSxDQUFDLElBQUksQ0FBQyxjQUFjLEdBQUcsQ0FBQyxNQUFNLEtBQUs7TUFDckMsTUFBTSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUM7O01BRW5ELElBQUksQ0FBQyxNQUFNLEVBQUU7UUFDWCxFQUFFLEtBQUssQ0FBQyxLQUFLLENBQUM7T0FDZjtNQUNELElBQUksQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLE1BQU0sRUFBRSxJQUFJLENBQUMsQ0FBQzs7TUFFbkMsRUFBRSxLQUFLLENBQUMsS0FBSyxDQUFDO01BQ2QsSUFBSSxJQUFJLENBQUMsS0FBSyxDQUFDLFNBQVMsRUFBRSxFQUFFO1FBQzFCQSxXQUFHLENBQUMsY0FBYyxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQzFCLE9BQU87T0FDUjtNQUNEQSxXQUFHLENBQUMsZUFBZSxDQUFDLEtBQUssQ0FBQyxDQUFDO0tBQzVCLENBQUM7O0lBRUYsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDMUMsSUFBSSxDQUFDLElBQUksQ0FBQyxjQUFjLEdBQUcsY0FBYyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDMUQsSUFBSSxDQUFDLElBQUksQ0FBQyxlQUFlLEdBQUcsZUFBZSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDNUQsSUFBSSxDQUFDLElBQUksQ0FBQyxjQUFjLEdBQUcsY0FBYyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7O0lBRTFELEtBQUssQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztHQUN4QztDQUNGOztBQ3ZDRCxNQUFNLGdCQUFnQixHQUFHLENBQUMsS0FBSyxLQUFLO0VBQ2xDLE1BQU0sYUFBYSxHQUFHO0lBQ3BCLG9CQUFvQixFQUFFLENBQUM7SUFDdkIsaUJBQWlCLEVBQUUsQ0FBQztJQUNwQixpQkFBaUIsRUFBRSxDQUFDO0lBQ3BCLGVBQWUsRUFBRSxLQUFLLENBQUMsS0FBSztHQUM3QixDQUFDOztFQUVGLE1BQU0sZ0JBQWdCLElBQUksQ0FBQyxHQUFHLEVBQUUsSUFBSSxLQUFLO0lBQ3ZDLFFBQVEsSUFBSTtNQUNWLEtBQUssQ0FBQyxPQUFPLENBQUM7UUFDWixFQUFFLGFBQWEsQ0FBQyxvQkFBb0IsQ0FBQztRQUNyQyxHQUFHLElBQUksR0FBRyxDQUFDO1FBQ1gsTUFBTTtNQUNSLEtBQUssQ0FBQyxJQUFJLENBQUM7UUFDVCxFQUFFLGFBQWEsQ0FBQyxvQkFBb0IsQ0FBQztRQUNyQyxFQUFFLGFBQWEsQ0FBQyxpQkFBaUIsQ0FBQztRQUNsQyxHQUFHLElBQUksR0FBRyxDQUFDO1FBQ1gsTUFBTTtNQUNSLEtBQUssQ0FBQyxJQUFJLENBQUM7UUFDVCxFQUFFLGFBQWEsQ0FBQyxvQkFBb0IsQ0FBQztRQUNyQyxFQUFFLGFBQWEsQ0FBQyxpQkFBaUIsQ0FBQztRQUNsQyxHQUFHLElBQUksRUFBRSxDQUFDO1FBQ1YsTUFBTTtLQUNUO0lBQ0QsT0FBTyxHQUFHLENBQUM7R0FDWixDQUFDLENBQUM7O0VBRUgsSUFBSSxXQUFXLEdBQUcsS0FBSyxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsZ0JBQWdCLEVBQUUsQ0FBQyxDQUFDO01BQ3ZELGFBQWEsQ0FBQyxlQUFlLEdBQUcsRUFBRSxDQUFDOztFQUV2QyxPQUFPO0lBQ0wsV0FBVzs7SUFFWCxjQUFjLEVBQUU7TUFDZCxhQUFhLEVBQUUsWUFBWSxDQUFDLGNBQWM7TUFDMUMsTUFBTSxFQUFFLGFBQWEsQ0FBQyxvQkFBb0I7TUFDMUMsTUFBTSxFQUFFLEtBQUssQ0FBQyxhQUFhLENBQUMsYUFBYSxDQUFDLG9CQUFvQixFQUFFLFlBQVksQ0FBQyxjQUFjLENBQUM7S0FDN0Y7O0lBRUQsbUJBQW1CLEVBQUU7TUFDbkI7UUFDRSxLQUFLLEVBQUUsQ0FBQyxpQkFBaUIsQ0FBQztRQUMxQixJQUFJLEVBQUUsQ0FBQyxJQUFJLENBQUM7UUFDWixhQUFhLEVBQUUsWUFBWSxDQUFDLHFCQUFxQjtRQUNqRCxNQUFNLEVBQUUsYUFBYSxDQUFDLGlCQUFpQjtRQUN2QyxNQUFNLEVBQUUsS0FBSyxDQUFDLGFBQWEsQ0FBQyxhQUFhLENBQUMsaUJBQWlCLEVBQUUsWUFBWSxDQUFDLHFCQUFxQixDQUFDO09BQ2pHO01BQ0Q7UUFDRSxLQUFLLEVBQUUsQ0FBQyxjQUFjLENBQUM7UUFDdkIsSUFBSSxFQUFFLENBQUMsS0FBSyxDQUFDO1FBQ2IsYUFBYSxFQUFFLFlBQVksQ0FBQyxvQkFBb0I7UUFDaEQsTUFBTSxFQUFFLGFBQWEsQ0FBQyxlQUFlO1FBQ3JDLE1BQU0sRUFBRSxLQUFLLENBQUMsYUFBYSxDQUFDLGFBQWEsQ0FBQyxlQUFlLEVBQUUsWUFBWSxDQUFDLG9CQUFvQixDQUFDO09BQzlGO01BQ0Q7UUFDRSxLQUFLLEVBQUUsQ0FBQyx1QkFBdUIsQ0FBQztRQUNoQyxJQUFJLEVBQUUsQ0FBQyxJQUFJLENBQUM7UUFDWixhQUFhLEVBQUUsQ0FBQyxZQUFZLENBQUMscUJBQXFCO1FBQ2xELE1BQU0sRUFBRSxhQUFhLENBQUMsaUJBQWlCO1FBQ3ZDLE1BQU0sRUFBRSxLQUFLLENBQUMsYUFBYSxDQUFDLGFBQWEsQ0FBQyxpQkFBaUIsRUFBRSxZQUFZLENBQUMscUJBQXFCLENBQUM7T0FDakc7S0FDRjtHQUNGLENBQUM7Q0FDSDs7QUM3REQsTUFBTSxVQUFVLFNBQVMsWUFBWSxDQUFDO0VBQ3BDLFdBQVcsQ0FBQyxJQUFJLEVBQUU7SUFDaEIsS0FBSyxFQUFFLENBQUM7SUFDUixJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQyxPQUFPLEVBQUUsQ0FBQztHQUM1Qjs7RUFFRCxJQUFJLFFBQVEsR0FBRztJQUNiO01BQ0UsQ0FBQzs7UUFFQyxFQUFFLElBQUksQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3BDLEVBQUUsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLEVBQUUsS0FBSyxLQUFLLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxJQUFJLEVBQUUsS0FBSyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNsRixDQUFDO01BQ1A7R0FDSDs7RUFFRCxLQUFLLENBQUMsS0FBSyxFQUFFO0lBQ1g7TUFDRSxLQUFLLENBQUMsT0FBTyxDQUFDLE1BQU0sS0FBSyxjQUFjLENBQUMsY0FBYztNQUN0RCxLQUFLLENBQUMsS0FBSyxJQUFJLGNBQWMsQ0FBQyxlQUFlO01BQzdDO0dBQ0g7O0VBRUQsY0FBYyxDQUFDLEtBQUssRUFBRTtJQUNwQixJQUFJLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLEVBQUU7TUFDckIsT0FBTyxDQUFDLGdCQUFnQixDQUFDLENBQUM7S0FDM0I7SUFDRCxPQUFPLENBQUMsbUJBQW1CLENBQUMsQ0FBQztHQUM5Qjs7RUFFRCxtQkFBbUIsQ0FBQyxLQUFLLEVBQUUsS0FBSyxFQUFFO0lBQ2hDLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxFQUFFO01BQ3RCO1FBQ0UsQ0FBQzs7dUNBRThCLEVBQUUsS0FBSyxDQUFDOztjQUVqQyxFQUFFLEtBQUssQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDOzs7OztnQkFLOUIsQ0FBQztRQUNUO0tBQ0g7O0lBRUQsTUFBTSxhQUFhLEdBQUcsZ0JBQWdCLENBQUMsS0FBSyxDQUFDLENBQUM7O0lBRTlDLE1BQU0sSUFBSSxHQUFHLGFBQWEsQ0FBQyxtQkFBbUIsQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLEtBQUssSUFBSSxDQUFDLG9CQUFvQixDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7O0lBRTlGO01BQ0UsQ0FBQzs7cUNBRThCLEVBQUUsS0FBSyxDQUFDOztZQUVqQyxFQUFFLEtBQUssQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDOzs0Q0FFQSxFQUFFLGFBQWEsQ0FBQyxjQUFjLENBQUMsYUFBYSxDQUFDO29DQUNyRCxFQUFFLGFBQWEsQ0FBQyxjQUFjLENBQUMsTUFBTSxDQUFDOztRQUVsRSxFQUFFLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDOztzRUFFNkMsRUFBRSxhQUFhLENBQUMsV0FBVyxDQUFDOztjQUVwRixDQUFDO01BQ1Q7R0FDSDs7RUFFRCxvQkFBb0IsQ0FBQyxJQUFJLEVBQUU7SUFDekIsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUU7TUFDaEIsT0FBTyxDQUFDLENBQUMsQ0FBQztLQUNYO0lBQ0Q7TUFDRSxDQUFDOztrQ0FFMkIsRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDO2tDQUNiLEVBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxnREFBZ0QsRUFBRSxJQUFJLENBQUMsSUFBSSxDQUFDOzBDQUNsRSxFQUFFLElBQUksQ0FBQyxhQUFhLENBQUM7a0NBQzdCLEVBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQztXQUNyQyxDQUFDO01BQ047R0FDSDs7RUFFRCxJQUFJLENBQUMsT0FBTyxFQUFFO0lBQ1osSUFBSSxDQUFDLE1BQU0sR0FBRyxPQUFPLENBQUMsYUFBYSxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQztJQUMvQyxhQUFhLENBQUMsSUFBSSxDQUFDLENBQUM7R0FDckI7Q0FDRjs7QUN6RkQsTUFBTSxZQUFZLENBQUM7RUFDakIsSUFBSSxDQUFDLEtBQUssRUFBRTtJQUNWLE1BQU0sSUFBSSxHQUFHLElBQUksVUFBVSxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQ25DLElBQUksQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDLElBQUksRUFBRSxDQUFDOztJQUU1QixLQUFLLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztHQUNuQztDQUNGOztBQUVELG1CQUFlLElBQUksWUFBWSxFQUFFLENBQUM7O0FDYmxDLE1BQU1FLGNBQVksR0FBRztFQUNuQixLQUFLLEVBQUUsQ0FBQyxVQUFVLENBQUM7RUFDbkIsTUFBTSxFQUFFLENBQUMsV0FBVyxDQUFDO0VBQ3JCLEtBQUssRUFBRSxDQUFDLFlBQVksQ0FBQztDQUN0QixDQUFDOztBQUVGLE1BQU0scUJBQXFCLEdBQUcsQ0FBQyxLQUFLLEtBQUs7RUFDdkMsT0FBTyxLQUFLLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksS0FBSztJQUNqQyxJQUFJLElBQUksQ0FBQyxJQUFJLEtBQUssQ0FBQyxRQUFRLENBQUMsRUFBRTtNQUM1QixJQUFJLENBQUMsSUFBSSxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUM7S0FDckI7SUFDRCxPQUFPO01BQ0wsR0FBRyxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRztNQUNuQixJQUFJLEVBQUUsSUFBSSxDQUFDLElBQUk7S0FDaEIsQ0FBQztHQUNILENBQUMsQ0FBQztDQUNKLENBQUM7O0FBRUYsTUFBTSxtQkFBbUIsR0FBRyxDQUFDLEtBQUssS0FBSztFQUNyQyxPQUFPO0lBQ0wsUUFBUSxFQUFFLEtBQUssQ0FBQyxRQUFRO0lBQ3hCLElBQUksRUFBRSxDQUFDLEtBQUssQ0FBQztJQUNiLE1BQU0sRUFBRSxxQkFBcUIsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxLQUFLLENBQUMsQ0FBQztHQUM5QyxDQUFDO0NBQ0gsQ0FBQzs7QUFFRixNQUFNLG9CQUFvQixHQUFHLENBQUMsS0FBSyxLQUFLO0VBQ3RDLE9BQU87SUFDTCxRQUFRLEVBQUUsS0FBSyxDQUFDLFFBQVE7SUFDeEIsSUFBSSxFQUFFLENBQUMsTUFBTSxDQUFDO0lBQ2QsS0FBSyxFQUFFLHFCQUFxQixDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztHQUN2QyxDQUFDO0NBQ0gsQ0FBQzs7QUFFRixNQUFNLG1CQUFtQixHQUFHLENBQUMsS0FBSyxLQUFLO0VBQ3JDLElBQUksV0FBVyxHQUFHLENBQUMsQ0FBQzs7RUFFcEIsTUFBTSxNQUFNLEdBQUcsS0FBSyxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLEtBQUs7SUFDekMsSUFBSSxJQUFJLENBQUMsSUFBSSxLQUFLLENBQUMsUUFBUSxDQUFDLEVBQUU7TUFDNUIsSUFBSSxDQUFDLElBQUksR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDO01BQ3BCLEVBQUUsV0FBVyxDQUFDO0tBQ2Y7SUFDRCxPQUFPO01BQ0wsR0FBRyxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRztNQUNuQixLQUFLLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLO01BQ3ZCLE1BQU0sRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU07TUFDekIsSUFBSSxFQUFFLElBQUksQ0FBQyxJQUFJO0tBQ2hCLENBQUM7R0FDSCxDQUFDLENBQUM7O0VBRUgsSUFBSSxNQUFNLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQztFQUNyQixJQUFJLFdBQVcsS0FBSyxDQUFDLEVBQUU7SUFDckIsTUFBTSxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUM7R0FDbEI7RUFDRCxPQUFPO0lBQ0wsUUFBUSxFQUFFLEtBQUssQ0FBQyxRQUFRO0lBQ3hCLE1BQU07SUFDTixJQUFJLEVBQUUsQ0FBQyxLQUFLLENBQUM7SUFDYixNQUFNO0dBQ1AsQ0FBQztDQUNILENBQUM7O0FBRUYsTUFBTSxpQkFBaUIsR0FBRztFQUN4QixDQUFDQSxjQUFZLENBQUMsS0FBSyxHQUFHLG1CQUFtQjtFQUN6QyxDQUFDQSxjQUFZLENBQUMsTUFBTSxHQUFHLG9CQUFvQjtFQUMzQyxDQUFDQSxjQUFZLENBQUMsS0FBSyxHQUFHLG1CQUFtQjtDQUMxQyxDQUFDOztBQUVGLE1BQU0sS0FBSyxHQUFHLENBQUMsSUFBSSxLQUFLO0VBQ3RCLE9BQU8sSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksS0FBSztJQUN4QixPQUFPLGlCQUFpQixDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQztHQUMzQyxDQUFDLENBQUM7Q0FDSjs7QUN4RUQsTUFBTSxTQUFTLEdBQUcsQ0FBQyxHQUFHLEtBQUs7RUFDekIsT0FBTyxJQUFJLE9BQU8sQ0FBQyxDQUFDLE1BQU0sRUFBRSxPQUFPLEtBQUs7SUFDdEMsTUFBTSxLQUFLLEdBQUcsSUFBSSxLQUFLLEVBQUUsQ0FBQztJQUMxQixLQUFLLENBQUMsTUFBTSxHQUFHLE1BQU0sTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQ25DLEtBQUssQ0FBQyxPQUFPLEdBQUcsTUFBTSxPQUFPLENBQUM7SUFDOUIsS0FBSyxDQUFDLEdBQUcsR0FBRyxHQUFHLENBQUM7R0FDakIsQ0FBQyxDQUFDO0NBQ0o7O0FDSkQsTUFBTSxVQUFVLEdBQUcsQ0FBQyxvQ0FBb0MsQ0FBQyxDQUFDO0FBQzFELE1BQU0sWUFBWSxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUM7O0FBRTlCLE1BQU0sTUFBTSxDQUFDO0VBQ1gsT0FBTyxRQUFRLEdBQUc7SUFDaEIsT0FBTyxLQUFLLENBQUMsQ0FBQyxFQUFFLFVBQVUsQ0FBQyxVQUFVLENBQUMsQ0FBQztRQUNuQyxJQUFJLENBQUMsQ0FBQyxRQUFRLEtBQUs7VUFDakIsSUFBSSxRQUFRLENBQUMsRUFBRSxFQUFFO1lBQ2YsT0FBTyxRQUFRLENBQUMsSUFBSSxFQUFFLENBQUM7V0FDeEI7VUFDRCxNQUFNLElBQUksS0FBSyxDQUFDLENBQUMscUNBQXFDLENBQUMsQ0FBQyxDQUFDO1NBQzFELENBQUM7U0FDRCxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7R0FDbEI7O0VBRUQsT0FBTyxVQUFVLENBQUMsSUFBSSxFQUFFLElBQUksR0FBRyxZQUFZLEVBQUU7SUFDM0MsTUFBTSxlQUFlLEdBQUc7TUFDdEIsSUFBSSxFQUFFLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDO01BQzFCLE9BQU8sRUFBRTtRQUNQLGNBQWMsRUFBRSxDQUFDLGdCQUFnQixDQUFDO09BQ25DO01BQ0QsTUFBTSxFQUFFLENBQUMsSUFBSSxDQUFDO0tBQ2YsQ0FBQzs7SUFFRixPQUFPLEtBQUssQ0FBQyxDQUFDLEVBQUUsVUFBVSxDQUFDLE9BQU8sRUFBRSxJQUFJLENBQUMsQ0FBQyxFQUFFLGVBQWUsQ0FBQyxDQUFDO0dBQzlEOztFQUVELE9BQU8sVUFBVSxDQUFDLElBQUksR0FBRyxZQUFZLEVBQUU7SUFDckMsT0FBTyxLQUFLLENBQUMsQ0FBQyxFQUFFLFVBQVUsQ0FBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQztRQUN2QyxJQUFJLENBQUMsQ0FBQyxRQUFRLEtBQUs7VUFDakIsSUFBSSxRQUFRLENBQUMsRUFBRSxFQUFFO1lBQ2YsT0FBTyxRQUFRLENBQUMsSUFBSSxFQUFFLENBQUM7V0FDeEI7VUFDRCxNQUFNLElBQUksS0FBSyxDQUFDLENBQUMscUNBQXFDLENBQUMsQ0FBQyxDQUFDO1NBQzFELENBQUMsQ0FBQztHQUNSOztFQUVELE9BQU8sUUFBUSxDQUFDLElBQUksRUFBRTtJQUNwQixNQUFNLGVBQWUsR0FBRyxJQUFJLEdBQUcsRUFBRSxDQUFDOztJQUVsQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsSUFBSSxLQUFLO01BQ3JCLElBQUksSUFBSSxDQUFDLElBQUksS0FBSyxDQUFDLE1BQU0sQ0FBQyxFQUFFO1FBQzFCLGVBQWUsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUNwQyxPQUFPO09BQ1I7O01BRUQsSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsQ0FBQyxLQUFLLEtBQUs7UUFDN0IsZUFBZSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7T0FDaEMsQ0FBQyxDQUFDO0tBQ0osQ0FBQyxDQUFDOztJQUVILE9BQU8sT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsZUFBZSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxLQUFLLFNBQVMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7R0FDekU7Q0FDRjs7QUNyREQsTUFBTSxXQUFXLFNBQVMsWUFBWSxDQUFDO0VBQ3JDLFdBQVcsQ0FBQyxPQUFPLEVBQUU7SUFDbkIsS0FBSyxFQUFFLENBQUM7O0lBRVIsSUFBSSxDQUFDLE9BQU8sR0FBRyxPQUFPLENBQUM7R0FDeEI7O0VBRUQsSUFBSSxRQUFRLEdBQUc7SUFDYjtNQUNFLENBQUMsMkJBQTJCLEVBQUUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUM7TUFDbEQ7R0FDSDs7RUFFRCxPQUFPLElBQUksQ0FBQyxPQUFPLEVBQUU7SUFDbkIsTUFBTSxLQUFLLEdBQUcsSUFBSSxXQUFXLENBQUMsT0FBTyxDQUFDLENBQUM7SUFDdkMsS0FBSyxDQUFDLGNBQWMsQ0FBQyxLQUFLLENBQUMsT0FBTyxFQUFFLFFBQVEsQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLENBQUM7R0FDMUQ7Q0FDRjs7QUNqQkQsTUFBTSxZQUFZLFNBQVMsWUFBWSxDQUFDO0VBQ3RDLFdBQVcsR0FBRztJQUNaLEtBQUssRUFBRSxDQUFDO0dBQ1Q7O0VBRUQsSUFBSSxRQUFRLEdBQUc7SUFDYjtNQUNFLENBQUM7Ozs7O2NBS08sQ0FBQztNQUNUO0dBQ0g7O0VBRUQsS0FBSyxHQUFHO0lBQ04sS0FBSyxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7R0FDbkM7Q0FDRjs7QUFFRCxhQUFlLElBQUksWUFBWSxFQUFFLENBQUM7O0FDaEJsQyxNQUFNLFlBQVksR0FBRztFQUNuQixRQUFRLEVBQUUsQ0FBQyxDQUFDO0VBQ1osS0FBSyxFQUFFLENBQUMsS0FBSyxDQUFDO0VBQ2QsSUFBSSxFQUFFLENBQUMsSUFBSSxDQUFDO0VBQ1osS0FBSyxFQUFFLENBQUMsS0FBSyxDQUFDO0NBQ2YsQ0FBQzs7QUFFRixNQUFNLFdBQVcsQ0FBQztFQUNoQixPQUFPLElBQUksQ0FBQyxNQUFNLEVBQUU7SUFDbEIsV0FBVyxDQUFDLE1BQU0sR0FBRztNQUNuQixDQUFDLFlBQVksQ0FBQyxRQUFRLEdBQUcsY0FBYztNQUN2QyxDQUFDLFlBQVksQ0FBQyxLQUFLLEdBQUcsV0FBVztNQUNqQyxDQUFDLFlBQVksQ0FBQyxJQUFJLEdBQUcsSUFBSSxVQUFVLENBQUMsS0FBSyxFQUFFLE1BQU0sQ0FBQztNQUNsRCxDQUFDLFlBQVksQ0FBQyxNQUFNLEdBQUcsWUFBWTtLQUNwQyxDQUFDO0lBQ0YsV0FBVyxDQUFDLGtCQUFrQixFQUFFLENBQUM7R0FDbEM7O0VBRUQsT0FBTyxrQkFBa0IsR0FBRztJQUMxQixJQUFJLENBQUMsTUFBTSxDQUFDLFlBQVksQ0FBQyxRQUFRLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQztHQUMzQzs7RUFFRCxPQUFPLGVBQWUsR0FBRztJQUN2QixJQUFJLENBQUMsTUFBTSxDQUFDLFlBQVksQ0FBQyxLQUFLLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQztHQUN4Qzs7RUFFRCxPQUFPLGNBQWMsQ0FBQyxLQUFLLEVBQUU7SUFDM0IsSUFBSSxDQUFDLE1BQU0sQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO0dBQzVDOztFQUVELE9BQU8sZUFBZSxDQUFDLEtBQUssRUFBRTtJQUM1QixNQUFNLENBQUMsS0FBSyxFQUFFLENBQUM7SUFDZixNQUFNLENBQUMsVUFBVSxDQUFDLEtBQUssRUFBRSxLQUFLLENBQUMsSUFBSSxDQUFDO1FBQ2hDLElBQUksQ0FBQyxNQUFNLE1BQU0sQ0FBQyxVQUFVLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ3pDLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLFlBQVksQ0FBQyxNQUFNLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQztHQUNqRDtDQUNGOztBQUVELElBQUksS0FBSyxHQUFHLEVBQUUsQ0FBQzs7QUFFZixNQUFNLFFBQVEsR0FBRyxDQUFDLElBQUksS0FBSztFQUN6QixLQUFLLEdBQUcsSUFBSSxDQUFDO0VBQ2IsT0FBTyxNQUFNLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDO0NBQzlCLENBQUM7O0FBRUYsTUFBTSxDQUFDLFFBQVEsRUFBRTtLQUNaLElBQUksQ0FBQyxRQUFRLENBQUM7S0FDZCxJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQztLQUN0QixLQUFLLENBQUNDLFdBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQzs7OzsiLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==
