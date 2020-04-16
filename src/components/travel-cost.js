import {createElement} from '../utils.js';

const createTravelCostTemplate = (totalCost) => {
  return (
    `<p class="trip-info__cost">
              Total: &euro;&nbsp;<span class="trip-info__cost-value">${totalCost}</span>
    </p>`
  );
};

export default class TravelCost {
  constructor(totalCost) {
    this._totalCost = totalCost;

    this._element = null;
  }

  getTemplate() {
    return createTravelCostTemplate(this._totalCost);
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
