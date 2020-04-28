import {formatDate, formatDateForPointList} from '../utils/common.js';
import AbstractComponent from './abstract-component.js';

const createTravelPointListTemplate = (number, date) => {
  return (
    `<ul class="trip-days">
            <li class="trip-days__item  day">
              <div class="day__info">
                ${number ? `
                <span class="day__counter">${number}</span>
                <time class="day__date" datetime="${formatDate(date)}">${formatDateForPointList(date)}</time>
                ` : ``}
              </div>

              <ul class="trip-events__list">
              </ul>
            </li>
          </ul>`
  );
};

export default class TravelPointList extends AbstractComponent {
  constructor(number = null, date = null) {
    super();

    this._number = number;
    this._date = date;
  }
  getTemplate() {
    return createTravelPointListTemplate(this._number, this._date);
  }
  getPlaceForPoint() {
    return this.getElement().querySelector(`.trip-events__list`);
  }
}
