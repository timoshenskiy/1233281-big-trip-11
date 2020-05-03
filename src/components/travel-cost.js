import AbstractComponent from './abstract-component.js';

const calculateTotalCost = (travelPoints) => {
  let totalCost = 0;
  for (const travelPoint of travelPoints) {
    let offersCost = 0;
    if (travelPoint.checkedOffers.length > 0) {
      offersCost = travelPoint.checkedOffers.reduce((sum, it) =>{
        console.log(totalCost);
        return sum + it.price;
      }, 0);
    }
    totalCost += travelPoint.price + offersCost;
  }
  return totalCost;
};

const createTravelCostTemplate = (travelPoints) => {
  const totalCost = calculateTotalCost(travelPoints);
  return (
    `<p class="trip-info__cost">
              Total: &euro;&nbsp;<span class="trip-info__cost-value">${totalCost}</span>
    </p>`
  );
};

export default class TravelCost extends AbstractComponent {
  constructor(travelPoints) {
    super();

    this._travelPoints = travelPoints;
  }

  getTemplate() {
    return createTravelCostTemplate(this._travelPoints);
  }
  updatePoints(travelPoints) {
    this._travelPoints = travelPoints;
    this._element.innerHTML = ``;
    this._element.innerHTML = this.getTemplate();
  }
}
