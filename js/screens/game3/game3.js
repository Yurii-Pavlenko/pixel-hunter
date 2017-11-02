import {getPictures} from "../../utils/get-pictures";
import pictures from "../../utils/pictures";
import {checkNext3, game3Data} from "./game3-data";
import Game3View from "./game3-view";
import {goBack, stateData} from "../play-data";
import gameStats from "../game-stats";

export default () => {
  const imgArray = getPictures(pictures, game3Data);

  const game3 = new Game3View(stateData, gameStats, imgArray[0], imgArray[1], imgArray[2]);

  game3.onButtonClick = () => checkNext3(stateData);

  game3.onBackClick = () => goBack(stateData);

  return game3;
};
