const LEFT_ARROW = 37;
const RIGHT_ARROW = 39;

const mainCentral = document.querySelector(`.central`);
const greeting = document.querySelector(`#greeting`);
const rules = document.querySelector(`#rules`);
const game1 = document.querySelector(`#game-1`);
const game2 = document.querySelector(`#game-2`);
const game3 = document.querySelector(`#game-3`);
const stats = document.querySelector(`#stats`);

const screenTemplates = [greeting, rules, game1, game2, game3, stats];

let activeTemplateNumber = 0;

// Function showing screens
const showScreen = (number) => {
  mainCentral.innerHTML = screenTemplates[number].innerHTML;
};

// Showing first screen
showScreen(activeTemplateNumber);

// Switch screens handler
const onButtonPush = (evt) => {
  if (evt.altKey && evt.keyCode === LEFT_ARROW && activeTemplateNumber > 0) {
    showScreen(--activeTemplateNumber);
  } else {
    if (evt.altKey && evt.keyCode === RIGHT_ARROW && activeTemplateNumber < screenTemplates.length - 1) {
      showScreen(++activeTemplateNumber);
    }
  }
};

document.addEventListener(`keydown`, onButtonPush);

