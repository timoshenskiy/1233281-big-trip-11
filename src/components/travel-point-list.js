import {createElement, formatTimeforDatetime, formatDateForPointList} from '../utils.js';

const createTravelPointListTemplate = (number, date) => {
  const datetime = formatTimeforDatetime(date, false);
  const pointsGroupDate = formatDateForPointList(date);
  return (
    `<ul class="trip-days">
            <li class="trip-days__item  day">
              <div class="day__info">
                <span class="day__counter">${number}</span>
                <time class="day__date" datetime="${datetime}">${pointsGroupDate}</time>
              </div>

              <ul class="trip-events__list">
              </ul>
            </li>
          </ul>`
  );
};

export default class PointList {
  constructor(number, date) {
    this._number = number;
    this._date = date;
    this._element = null;
  }

  getTemplate() {
    return createTravelPointListTemplate(this._number, this._date);
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}
