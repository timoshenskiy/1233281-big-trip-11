import {POINT_TYPES_TRANSFER, POINT_TYPES_ACTIVITY, POINT_OFFERS_TITLES} from '../const.js';
import {getRandomIntegerNumber} from '../utils/common.js';

const generatePointOffer = () => {
  const pointTypes = Math.random() > 0.5 ? POINT_TYPES_TRANSFER : POINT_TYPES_ACTIVITY;
  return {
    type: pointTypes[getRandomIntegerNumber(0, pointTypes.length - 1)],
    title: POINT_OFFERS_TITLES[getRandomIntegerNumber(0, POINT_OFFERS_TITLES.length - 1)],
    price: 5 + Math.floor((Math.random() * 20)) * 5,
  };

};

export const generatePointOffers = (count) => {
  return new Array(count)
    .fill(``)
    .map(generatePointOffer);
};

