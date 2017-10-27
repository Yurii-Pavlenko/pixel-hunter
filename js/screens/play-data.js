const INITIAL_DATA = {
  game: 0,
  time: 30,
  lives: 3,
  answers: new Array(10).fill(`unknown`),
  victory: false
};

export let stateData = JSON.parse(JSON.stringify(INITIAL_DATA));

import renderScreen from "../utils/screen-renderer";
import greeting from "./greeting/greeting";

const resetStateData = () => {
  stateData = JSON.parse(JSON.stringify(INITIAL_DATA));
};

export const goBack = (state) => {
  if (state) {
    resetStateData();
  }
  renderScreen(greeting);
};

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
