import {getPictures} from "../../utils/get-pictures";
import pictures from "../../utils/pictures";
import {game2Date} from "./game2-data";
import Game2View from "./game2-view";
import {goBack, stateData} from "../play-data";
import gameStats from "../game-stats";
import checkNext from "../../utils/check-next";

export default () => {
  const img = getPictures(pictures, game2Date);

  const game2 = new Game2View(stateData, gameStats, img);

  game2.onButtonClick = () => checkNext(stateData, game2Date);
  game2.onBackClick = () => goBack(stateData);

  return game2;
};
