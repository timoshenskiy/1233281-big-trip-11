import moment from "moment";
import {MONTH_NAMES, POINT_TYPES_TRANSFER} from "../const.js";

const stopInteractionWithApplication = () => {
  document.querySelectorAll(`button`).forEach((it) => {
    it.disabled = true;
  });
  document.querySelectorAll(`input`).forEach((it) => {
    it.disabled = true;
  });

};
const startInteractionWithApplication = () => {
  document.querySelectorAll(`button`).forEach((it) => {
    it.disabled = false;
  });
  document.querySelectorAll(`input`).forEach((it) => {
    it.disabled = false;
  });

};

const getRandomIntegerNumber = (min, max) => {
  return min + Math.floor(Math.random() * (max - min));
};

const findCorrectPrepostion = (pointType) => {
  return POINT_TYPES_TRANSFER.some((it) => {
    return it === pointType;
  }) ? `to` : `in`;
};

const makeFirstSymbolUppercase = (string) => {
  string = string[0].toUpperCase() + string.slice(1);
  return string;
};

const formatTime = (date) => {
  return moment(date).format(`HH:mm`);
};
const checkIsPastDay = (date, currentDate) => {
  return date < currentDate;

};
const checkIsFutureDay = (date, currentDate) => {
  return date > currentDate;
};
const formatDate = (date) => {
  return moment(date).format(`YYYY-MM-DD`);
};

const formatTimeforInput = (date) => {
  return moment(date).format(`DD/MM/YY HH:mm`);
};

const formatDatePeriod = (firstDate, lastDate) => {
  const firstMonth = MONTH_NAMES[firstDate.getMonth()];
  const lastMonth = (firstMonth === MONTH_NAMES[lastDate.getMonth()]) ? `` : MONTH_NAMES[lastDate.getMonth()];
  const firstDay = firstDate.getDate();
  const lastDay = lastDate.getDate();
  return `${firstMonth} ${firstDay}&nbsp;&mdash;&nbsp;${lastMonth} ${lastDay}`;
};
const formatDateDifference = (date1, date2) => {
  const arrivalDate = moment(date1);
  const departureDate = moment(date2);

  const days = departureDate.diff(arrivalDate, `days`);
  departureDate.subtract(days, `days`);
  const hours = departureDate.diff(arrivalDate, `hours`);
  departureDate.subtract(hours, `hours`);
  const minutes = departureDate.diff(arrivalDate, `minutes`);

  return `${days !== 0 ? `${days}D` : ``}  ${(hours !== 0 || days !== 0) ? `${hours}H` : ``} ${(hours !== 0 || days !== 0 || minutes !== 0) ? `${minutes}M` : ``} `;
};
const formatDateForPointList = (date) => {
  return moment(date).format(`MMM DD`);

};
export {stopInteractionWithApplication, startInteractionWithApplication, findCorrectPrepostion, getRandomIntegerNumber, makeFirstSymbolUppercase, checkIsFutureDay, checkIsPastDay, formatDate, formatTime, formatDatePeriod, formatDateDifference, formatDateForPointList, formatTimeforInput};
