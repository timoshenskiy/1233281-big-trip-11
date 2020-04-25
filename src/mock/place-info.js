import {POINT_DESTINATIONS, POINT_DESCRIPTIONS} from '../const.js';
import {getRandomIntegerNumber} from '../utils/common.js';


const generatePlaceDescription = (count) => {
  let description = ``;
  while (count > 0) {
    count--;
    description += POINT_DESCRIPTIONS[getRandomIntegerNumber(0, POINT_DESCRIPTIONS.length - 1)];
  }
  return description;
};
const generatePhotoUrl = () => {
  return `http://picsum.photos/248/152?r=${Math.random()}`;
};
const generatePhotoUrls = (count) => {
  return new Array(count)
    .fill(``)
    .map(generatePhotoUrl);
};

const placesInfo = [];
POINT_DESTINATIONS.forEach((it) => {
  placesInfo.push(
      {
        name: it,
        description: generatePlaceDescription(getRandomIntegerNumber(1, 5)),
        photos: generatePhotoUrls(getRandomIntegerNumber(1, 6)),
      });
});

export {placesInfo};


