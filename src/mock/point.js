import {POINT_TYPES_TRANSFER, POINT_TYPES_ACTIVITY, POINT_DESTINATIONS, POINT_DESCRIPTIONS} from '../const.js';
import {getRandomIntegerNumber} from '../utils/common.js';
import {generatePointOffers} from './offers.js';

const generatePointType = () => {
  const pointTypeArray = Math.random() > 0.5 ? POINT_TYPES_TRANSFER : POINT_TYPES_ACTIVITY;
  return pointTypeArray[getRandomIntegerNumber(0, pointTypeArray.length - 1)];
};
const findCorrectPrepostion = (pointType) => {
  return POINT_TYPES_TRANSFER.some((it) => {
    return it === pointType;
  }) ? `to` : `in`;
};
const generateDepartureDate = () => {
  let departureDate = new Date();
  departureDate.setMonth(getRandomIntegerNumber(0, 2));
  departureDate.setDate(getRandomIntegerNumber(1, 28));
  departureDate.setHours(getRandomIntegerNumber(0, 23));
  departureDate.setMinutes(getRandomIntegerNumber(0, 11) * 5);
  departureDate.setSeconds(0);
  return departureDate;
};
const generateArrivalDate = (date) => {
  let arrivalDate = new Date();
  arrivalDate.setMonth(date.getMonth());
  arrivalDate.setDate(date.getDate());
  arrivalDate.setHours(date.getHours() + getRandomIntegerNumber(1, 36));
  arrivalDate.setMinutes(date.getMinutes() + getRandomIntegerNumber(1, 11) * 5);
  arrivalDate.setSeconds(0);
  return arrivalDate;
};
const generatePhotoUrl = () => {
  return `http://picsum.photos/248/152?r=${Math.random()}`;
};
const generatePhotoUrls = (count) => {
  return new Array(count)
    .fill(``)
    .map(generatePhotoUrl);
};
const generatePointDescription = (count) => {
  let description = ``;
  while (count > 0) {
    count--;
    description += POINT_DESCRIPTIONS[getRandomIntegerNumber(0, POINT_DESCRIPTIONS.length - 1)];
  }
  return description;
};

const separateOffers = (allOffers) => {
  let checkedOffers = [];
  let uncheckedOffers = [];
  for (const offer of allOffers) {
    if (Math.random() > 0.5) {
      checkedOffers.push(offer);
    } else {
      uncheckedOffers.push(offer);
    }
  }
  return [checkedOffers, uncheckedOffers];
};


const generateTravelPoint = () => {
  const type = generatePointType();
  const departureDate = generateDepartureDate();
  const allPointOffers = generatePointOffers(getRandomIntegerNumber(1, 5));
  const [checkedPointOffers, uncheckedPointOffers] = separateOffers(allPointOffers);
  return {
    type,
    preposition: findCorrectPrepostion(type),
    destination: POINT_DESTINATIONS[getRandomIntegerNumber(0, POINT_DESTINATIONS.length)],
    departureDate,
    arrivalDate: generateArrivalDate(departureDate),
    price: getRandomIntegerNumber(10, 50) * 10,
    photos: generatePhotoUrls(getRandomIntegerNumber(1, 6)),
    description: generatePointDescription(getRandomIntegerNumber(1, 5)),
    checkedOffers: checkedPointOffers,
    uncheckedOffers: uncheckedPointOffers,
  };
};
const generateTravelPoints = (count) => {
  return new Array(count)
    .fill(``)
    .map(generateTravelPoint);
};


export {generateTravelPoints};
