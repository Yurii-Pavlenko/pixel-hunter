import {getPictures} from "../../utils/get-pictures";
import pictures from "../../utils/pictures";
import {game1Data} from "./game1-data";
import Game1View from "./game1-view";
import {goBack, stateData} from "../play-data";
import gameStats from "../game-stats";
import checkNext from "../../utils/check-next";

export default () => {
  const imgArray = getPictures(pictures, game1Data.IMG_NUMBER);
  const game1 = new Game1View(stateData, gameStats, imgArray[0], imgArray[1]);

  game1.onButtonClick = () => checkNext(stateData, game1Data);
  game1.onBackClick = () => goBack(stateData);

  return game1;
};
