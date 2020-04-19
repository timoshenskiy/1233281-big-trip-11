import {MONTH_NAMES} from './const.js';

const createElement = (template) => {
  const newElement = document.createElement(`div`);
  newElement.innerHTML = template;

  return newElement.firstChild;
};

const RenderPosition = {
  AFTERBEGIN: `afterbegin`,
  BEFOREEND: `beforeend`,
  AFTEREND: `afterend`
};

const render = (container, element, place) => {
  switch (place) {
    case RenderPosition.AFTERBEGIN:
      container.prepend(element);
      break;
    case RenderPosition.BEFOREEND:
      container.append(element);
      break;
    case RenderPosition.AFTEREND:
      container.after(element);
      break;
  }
};

const getRandomIntegerNumber = (min, max) => {
  return min + Math.floor(Math.random() * (max - min));
};

const makeFirstSymbolUppercase = (string) => {
  string = string[0].toUpperCase() + string.slice(1);
  return string;
};

const castTimeFormat = (value) => {
  return value < 10 ? `0${value}` : String(value);
};

const formatTime = (date) => {
  const hours = castTimeFormat(date.getHours() % 12);
  const minutes = castTimeFormat(date.getMinutes());

  return `${hours}:${minutes}`;
};

const formatTimeforInput = (date) => {
  const day = castTimeFormat(date.getDate());
  const month = castTimeFormat(date.getMonth() + 1);
  const year = `${date.getFullYear()}`.substr(2, 4);
  const hour = castTimeFormat(date.getHours());
  const minute = castTimeFormat(date.getMinutes());
  return `${day}/${month}/${year} ${hour}:${minute}`;
};
const formatTimeforDatetime = (date, time = true) => {
  const day = castTimeFormat(date.getDate());
  const month = castTimeFormat(date.getMonth() + 1);
  const year = `${date.getFullYear()}`.substr(2, 4);
  const hour = castTimeFormat(date.getHours());
  const minute = castTimeFormat(date.getMinutes());
  return `${day}-${month}-${year}${time ? `T${hour}:${minute}` : ``}`;
};

const formatDatePeriod = (firstDate, lastDate) => {
  const firstMonth = MONTH_NAMES[firstDate.getMonth()];
  const lastMonth = (firstMonth === MONTH_NAMES[lastDate.getMonth()]) ? `` : MONTH_NAMES[lastDate.getMonth()];
  const firstDay = firstDate.getDate();
  const lastDay = lastDate.getDate();
  return `${firstMonth} ${firstDay}&nbsp;&mdash;&nbsp;${lastMonth} ${lastDay}`;
};
const formatDateDifference = (differenceInMs) => {
  let milliseconds = differenceInMs;
  const days = Math.floor(milliseconds / 1000 / 60 / 60 / 24);
  milliseconds -= days * 24 * 60 * 60 * 1000;
  const hours = Math.floor(milliseconds / 1000 / 60 / 60);
  milliseconds -= hours * 60 * 60 * 1000;
  const minutes = Math.floor(milliseconds / 1000 / 60);

  return `${days !== 0 ? `${castTimeFormat(days)}D` : ``}  ${(hours !== 0 || days !== 0) ? `${castTimeFormat(hours)}H` : ``} ${(hours !== 0 || days !== 0 || minutes !== 0) ? `${castTimeFormat(minutes)}M` : ``} `;
};
const formatDateForPointList = (date) => {
  const month = MONTH_NAMES[date.getMonth()];
  const day = castTimeFormat(date.getDate());
  return `${month} ${day}`;

};
export {render, RenderPosition, createElement, getRandomIntegerNumber, makeFirstSymbolUppercase, formatTime, formatDatePeriod, formatDateDifference, formatDateForPointList, formatTimeforInput, formatTimeforDatetime};
