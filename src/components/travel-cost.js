import AbstractComponent from './abstract-component.js';

const createTravelCostTemplate = (totalCost) => {
  return (
    `<p class="trip-info__cost">
              Total: &euro;&nbsp;<span class="trip-info__cost-value">${totalCost}</span>
    </p>`
  );
};

export default class TravelCost extends AbstractComponent{
  constructor(totalCost) {
    super();

    this._totalCost = totalCost;
  }

  getTemplate() {
    return createTravelCostTemplate(this._totalCost);
  }
}
