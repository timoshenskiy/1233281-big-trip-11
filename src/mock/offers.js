import {POINT_TYPES_TRANSFER, POINT_TYPES_ACTIVITY, POINT_OFFERS_TITLES} from '../const.js';
import {getRandomIntegerNumber} from '../utils/common.js';

const generateOffers = (count) => {
  const offers = [];
  while (count > 0) {
    offers.push({
      title: POINT_OFFERS_TITLES[getRandomIntegerNumber(0, POINT_OFFERS_TITLES.length - 1)],
      price: 5 + Math.floor((Math.random() * 20)) * 5,

    });
    count--;
  }
  return offers;


};

const offersForEvents = [];
const pointTypes = [].concat(POINT_TYPES_TRANSFER, POINT_TYPES_ACTIVITY);
pointTypes.forEach((it) => {
  offersForEvents.push(
      {
        type: it,
        list: generateOffers(getRandomIntegerNumber(0, 6)),
      });
});

export {offersForEvents};


