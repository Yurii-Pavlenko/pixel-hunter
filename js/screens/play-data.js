const initialData = {
  game: 0,
  time: 30,
  lives: 3,
  answers: [`unknown`, `unknown`, `unknown`, `unknown`, `unknown`, `unknown`, `unknown`, `unknown`, `unknown`, `unknown`]
};

export let stateData = JSON.parse(JSON.stringify(initialData));

const getOffGame = 3;

const quantity = {
  unknownAnswers: stateData.answers.filter((element) =>{
    return element === `unknown`;
  }),
  wrongAnswers: stateData.answers.filter((element) =>{
    return element === `wrong`;
  })
};

export const isLives = () => {
  return quantity.wrongAnswers.length === getOffGame;
};

export const isQuestions = () => {
  return !quantity.unknownAnswers.length;
};
