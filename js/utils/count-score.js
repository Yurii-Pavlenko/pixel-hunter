const countScore = (answers, amountOfLives) => {
  const arrayLength = 10;
  const correctAnswerScore = 100;
  const quickAnswerScore = 150;
  const slowAnswerScore = 50;
  const livesScore = 50;
  const minTruthyAnswersAmount = 7;

  if (answers.length < arrayLength && !amountOfLives) {
    return -1;
  }

  const trueAnswers = answers.filter((element) => {
    return element === correctAnswerScore;
  });

  const fastAnswers = answers.filter((element) => {
    return element === quickAnswerScore;
  });

  const slowAnswers = answers.filter((element) => {
    return element === slowAnswerScore;
  });

  const scoreForRightAnswers = trueAnswers.length * correctAnswerScore;
  const scoreForFastAnswers = fastAnswers.length * quickAnswerScore;
  const scoreForSlowAnswers = slowAnswers.length * slowAnswerScore;
  const scoreForLives = amountOfLives * livesScore;

  const scoreForAllAnswers = scoreForRightAnswers + scoreForFastAnswers + scoreForSlowAnswers + scoreForLives;

  const truthyAnswersAmount = trueAnswers.length + fastAnswers.length + slowAnswers.length;

  return truthyAnswersAmount >= minTruthyAnswersAmount ? scoreForAllAnswers : -1;

};

export default countScore;
