const countScore = (answers, amountOfLives) => {
  const arrayLength = 10;
  const answerScore = {
    right: 100,
    fast: 150,
    slow: 50
  };
  const livesScore = 50;
  const maxFalsyAnswersAmount = 3;
  const maxFastAnswerValue = 10;
  const minSlowAnswerValue = 20;
  let quantity = {
    fast: 0,
    right: 0,
    slow: 0,
    false: 0
  };

  if (answers.length < arrayLength && !amountOfLives) {
    return -1;
  }

  answers.forEach((item) => {
    if (item < 0) {
      quantity.false += 1;
    } else if (item < maxFastAnswerValue) {
      quantity.fast += 1;
    } else if (item >= maxFastAnswerValue && item <= minSlowAnswerValue) {
      quantity.right += 1;
    } else if (item > minSlowAnswerValue) {
      quantity.slow += 1;
    }
  });

  const scoreFor = {
    rightAnswers() {
      return quantity.right * answerScore.right;
    },
    fastAnswers() {
      return quantity.fast * answerScore.fast;
    },
    slowAnswers() {
      return quantity.slow * answerScore.slow;
    },
    lives() {
      return amountOfLives * livesScore;
    },
    allAnswers() {
      return this.rightAnswers() + this.fastAnswers() + this.slowAnswers() + this.lives();
    }
  };

  return quantity.false > maxFalsyAnswersAmount ? -1 : scoreFor.allAnswers();
};

export default countScore;
