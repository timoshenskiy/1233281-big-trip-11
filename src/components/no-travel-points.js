import {createElement} from '../utils.js';

const createEmptyPointListTemplate = () => {
  return (
    `<section class="trip-events">
          <h2 class="visually-hidden">Trip events</h2>

          <p class="trip-events__msg">Click New Event to create your first point</p>
        </section>`
  );
};

export default class NoPoints {
  constructor() {
    this._element = null;
  }

  getTemplate() {
    return createEmptyPointListTemplate();
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
