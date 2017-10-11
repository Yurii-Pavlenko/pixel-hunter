import countScore from "./count-score";
import * as assert from "assert";

describe(`COUNT SCORE FUNCTION`, () => {

  const wrongAnswer = 0;
  const correctAnswer = 100;
  const quickAnswer = 150;
  const slowAnswer = 50;
  const fullLives = 3;
  const twoLives = 2;
  const oneLive = 1;
  const noUnusedLives = 0;
  const falsyArray = [correctAnswer, correctAnswer, correctAnswer, correctAnswer, correctAnswer, correctAnswer, wrongAnswer, wrongAnswer, wrongAnswer, wrongAnswer];
  const truthyArray = [correctAnswer, correctAnswer, correctAnswer, correctAnswer, correctAnswer, correctAnswer, correctAnswer, correctAnswer, correctAnswer, correctAnswer];
  const truthyFastArray = [correctAnswer, correctAnswer, quickAnswer, correctAnswer, correctAnswer, correctAnswer, correctAnswer, quickAnswer, correctAnswer, correctAnswer];
  const oneFalseAnswerArray = [wrongAnswer, correctAnswer, correctAnswer, correctAnswer, correctAnswer, correctAnswer, correctAnswer, correctAnswer, correctAnswer, correctAnswer];
  const twoFastAnswerArray = [wrongAnswer, wrongAnswer, wrongAnswer, quickAnswer, correctAnswer, correctAnswer, correctAnswer, correctAnswer, correctAnswer, correctAnswer];
  const twoSlowAnswerArray = [wrongAnswer, correctAnswer, quickAnswer, quickAnswer, correctAnswer, correctAnswer, slowAnswer, correctAnswer, slowAnswer, correctAnswer];
  const allSlowAnswerArray = [slowAnswer, slowAnswer, slowAnswer, slowAnswer, slowAnswer, slowAnswer, slowAnswer, slowAnswer, slowAnswer, slowAnswer];
  const allSlow3MissedAnswerArray = [slowAnswer, wrongAnswer, slowAnswer, wrongAnswer, slowAnswer, slowAnswer, slowAnswer, wrongAnswer, slowAnswer, slowAnswer];

  it(`should return "- 1" if answers < 10 and lives = 0`, () => {
    assert.equal(countScore([wrongAnswer, correctAnswer, quickAnswer, slowAnswer], 0), -1); // player lost
  });

  it(`should return "- 1" if amount of false answers < 7`, () => {
    assert.equal(countScore(falsyArray, noUnusedLives), -1);
  });

  it(`should return 1150 if all answers are right. With full of unused lives`, () => {
    assert.equal(countScore(truthyArray, fullLives), 1150);
  });

  it(`should return 1250 if all answers are right and two answers fast. With full of unused lives`, () => {
    assert.equal(countScore(truthyFastArray, fullLives), 1250);
  });

  it(`should return 1000 if only one answer is false. With two unused lives`, () => {
    assert.equal(countScore(oneFalseAnswerArray, twoLives), 1000);
  });

  it(`should return 750 if three answers are false and two answers are fast. Without unused lives`, () => {
    assert.equal(countScore(twoFastAnswerArray, noUnusedLives), 750);
  });

  it(`should return 1050 if one answer is false, two answers are fast and two answers are slow. With three of unused lives`, () => {
    assert.equal(countScore(twoSlowAnswerArray, fullLives), 1050);
  });

  it(`should return 550 if all answers are slow. With one of unused lives`, () => {
    assert.equal(countScore(allSlowAnswerArray, oneLive), 550);
  });

  it(`should return 350 if all answers are slow. With no of unused lives`, () => {
    assert.equal(countScore(allSlow3MissedAnswerArray, noUnusedLives), 350);
  });

});
