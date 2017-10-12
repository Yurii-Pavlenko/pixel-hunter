const countScore = (answers, amountOfLives) => {
  const arrayLength = 10;
  const correctAnswerScore = 100;
  const quickAnswerScore = 150;
  const slowAnswerScore = 50;
  const livesScore = 50;
  const maxFalsyAnswersAmount = 3;
  const maxFastAnswerValue = 10;
  const minSlowAnswerValue = 20;
  let fastAnswersQuantity = 0;
  let rightAnswersQuantity = 0;
  let slowAnswersQuantity = 0;
  let falseAnswersQuantity = 0;

  if (answers.length < arrayLength && !amountOfLives) {
    return -1;
  }

  answers.forEach((item) => {
    if (item < 0) {
      falseAnswersQuantity += 1;
    } else if (item < maxFastAnswerValue) {
      fastAnswersQuantity += 1;
    } else if (item >= maxFastAnswerValue && item <= minSlowAnswerValue) {
      rightAnswersQuantity += 1;
    } else if (item > minSlowAnswerValue) {
      slowAnswersQuantity += 1;
    }
  });

  const scoreForRightAnswers = rightAnswersQuantity * correctAnswerScore;
  const scoreForFastAnswers = fastAnswersQuantity * quickAnswerScore;
  const scoreForSlowAnswers = slowAnswersQuantity * slowAnswerScore;
  const scoreForLives = amountOfLives * livesScore;

  const scoreForAllAnswers = scoreForRightAnswers + scoreForFastAnswers + scoreForSlowAnswers + scoreForLives;

  return falseAnswersQuantity > maxFalsyAnswersAmount ? -1 : scoreForAllAnswers;
};

export default countScore;
