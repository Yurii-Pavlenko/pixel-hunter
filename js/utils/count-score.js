const countScore = (answers, amountOfLives) => {
  const arrayLength = 10;
  const correctAnswerScore = 100;
  const quickAnswerScore = 150;
  const slowAnswerScore = 50;
  const scoreForLives = 50;
  const minTruthyAnswersAmount = 7;

  if (answers.length < arrayLength && !amountOfLives) {
    return -1;
  }

  const trueAnswers = answers.filter(function (element) {
    return element === correctAnswerScore;
  });

  const fastAnswers = answers.filter(function (element) {
    return element === quickAnswerScore;
  });

  const slowAnswers = answers.filter(function (element) {
    return element === slowAnswerScore;
  });

  return trueAnswers.length + fastAnswers.length + slowAnswers.length >= minTruthyAnswersAmount ? trueAnswers.length * correctAnswerScore + fastAnswers.length * quickAnswerScore + slowAnswers.length * slowAnswerScore + amountOfLives * scoreForLives : -1;

};

export default countScore;
