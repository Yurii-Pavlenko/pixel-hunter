import greeting from "./greeting/greeting";

const INITIAL_DATA = {
  gameNumber: 0,
  time: 23,
  lives: 3,
  answers: new Array(10).fill(`unknown`),
  victory: false
};

export let stateData = JSON.parse(JSON.stringify(INITIAL_DATA));

import renderScreen from "../utils/screen-renderer";


const resetStateData = () => {
  stateData = JSON.parse(JSON.stringify(INITIAL_DATA));
};

export const goBack = (state) => {
  if (state) {
    resetStateData();
  }
  renderScreen(greeting);
};

export const chooseAnswerType = () => {
  let answerType;
  if (stateData.time > 20) {
    answerType = `fast`;
  } else if (stateData.time <= 20 && stateData.time >= 10) {
    answerType = `correct`;
  } else {
    answerType = `slow`;
  }
  return answerType;
};
