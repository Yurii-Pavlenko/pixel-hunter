const getRandom = (min, max) => Math.floor(Math.random() * (max - min) + min);

export const getPictures = (picturesArray, imgNumber) => {
  const paintArray = picturesArray.filter((img) => img.imgType === `paint`);
  const photoArray = picturesArray.filter((img) => img.imgType === `photo`);
  let imgArray = [];

  if (imgNumber === 1) {
    imgArray = picturesArray[getRandom(0, picturesArray.length)];
  } else if (imgNumber === 2) {
    imgArray = [
      paintArray[getRandom(0, paintArray.length)],
      photoArray[getRandom(0, photoArray.length)]
    ];
    if (getRandom(0, 2)) {
      imgArray = imgArray.reverse();
    }
  } else if (imgNumber === 3) {
    while (imgArray.length < imgNumber) {
      let img = photoArray[getRandom(0, photoArray.length)];
      if (imgArray.indexOf(img) === -1) {
        imgArray.push(img);
      }
    }
    const randomIndex = getRandom(0, imgNumber);
    imgArray[randomIndex] = paintArray[getRandom(0, paintArray.length)];
  }

  return imgArray;
};
