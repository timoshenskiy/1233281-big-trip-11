import {pointTypesTransfer, pointTypesActivity, pointDestinations, pointDescriptions, pointOffers} from '../const.js';


const getRandomIntegerNumber = (min, max) => {
  return min + Math.floor(Math.random() * (max - min));
};
const generatePointType = () => {
  const pointTypeArray = Math.random() > 0.5 ? pointTypesTransfer : pointTypesActivity;
  return pointTypeArray[getRandomIntegerNumber(0, pointTypeArray.length - 1)];
};
const findCorrectPrepostion = (pointType) => {
  return pointTypesTransfer.some((it) => {
    return it === pointType;
  }) ? `to` : `in`;
};
const generateDepartureDate = () => {
  let departureDate = new Date();
  departureDate.setMonth(getRandomIntegerNumber(0, 4));
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
    description += pointDescriptions[getRandomIntegerNumber(0, pointDescriptions.length - 1)];
  }
  return description;
};
const generateOffers = (maxCount) => {
  let offers = [];
  for (const offer of pointOffers) {
    if (Math.random() > 0.5) {
      offers.push(offer);
    }
  }
  return offers.slice(0, maxCount + 1);
};


const generateTravelPoint = () => {
  const pointType = generatePointType();
  const departureDate = generateDepartureDate();
  return {
    pointType,
    preposition: findCorrectPrepostion(pointType),
    destination: pointDestinations[getRandomIntegerNumber(0, pointDestinations.length)],
    departureDate,
    arrivalDate: generateArrivalDate(departureDate),
    eventPrice: getRandomIntegerNumber(10, 50) * 10,
    photos: generatePhotoUrls(getRandomIntegerNumber(1, 6)),
    pointDescription: generatePointDescription(getRandomIntegerNumber(1, 5)),
    offers: Math.random() > 0.5 ? generateOffers(5) : [],
  };


};

const generateTravelPoints = (count) => {
  return new Array(count)
    .fill(``)
    .map(generateTravelPoint);
};

export {generateTravelPoints};
