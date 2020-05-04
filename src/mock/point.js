import {POINT_TYPES_TRANSFER, POINT_TYPES_ACTIVITY} from '../const.js';
import {getRandomIntegerNumber} from '../utils/common.js';
import {offersForEvents} from './offers.js';
import {placesInfo} from './place-info.js';

const generatePointType = () => {
  const pointTypeArray = Math.random() > 0.5 ? POINT_TYPES_TRANSFER : POINT_TYPES_ACTIVITY;
  return pointTypeArray[getRandomIntegerNumber(0, pointTypeArray.length - 1)];
};
const generateDepartureDate = () => {
  let departureDate = new Date();
  departureDate.setMonth(getRandomIntegerNumber(3, 5));
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
  let offers = [];
  for (const offersForEvent of offersForEvents) {
    if (offersForEvent.type === type) {
      offers = offersForEvent.list;

    }
  }
  const [checkedPointOffers, uncheckedPointOffers] = separateOffers(offers);

  const placeInfo = placesInfo[getRandomIntegerNumber(0, placesInfo.length - 1)];

  return {
    id: String(new Date() + Math.random()),
    type,
    destination: placeInfo.name,
    departureDate,
    arrivalDate: generateArrivalDate(departureDate),
    price: getRandomIntegerNumber(10, 50) * 10,
    photos: placeInfo.photos,
    description: placeInfo.description,
    checkedOffers: checkedPointOffers,
    uncheckedOffers: uncheckedPointOffers,
    isFavorite: Math.random() > 0.5 ? true : false,
  };
};
const generateTravelPoints = (count) => {
  return new Array(count)
    .fill(``)
    .map(generateTravelPoint);
};


export {generateTravelPoints};
