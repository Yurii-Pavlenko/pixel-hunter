import renderScreen from "./screen-renderer";
import stats from "../screens/stats/stats";

const checkNext = (stateData, data) => {
  if (stateData.lives < 0) {
    stateData.victory = false;
    renderScreen(stats());
  } else {
    renderScreen(data.jumpTo.next());
  }
};

export default checkNext;
