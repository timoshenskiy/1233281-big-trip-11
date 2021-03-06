import AbstractComponent from './abstract-component.js';

export const calculateTotalCost = (travelPoints) => {
  let totalCost = 0;
  for (const travelPoint of travelPoints) {
    let offersCost = 0;
    if (travelPoint.checkedOffers.length > 0) {
      offersCost = travelPoint.checkedOffers.reduce((sum, it) =>{
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
  constructor(pointsModel) {
    super();

    this.pointsModel = pointsModel;
    this._travelPoints = pointsModel.getAllPoints();
  }

  getTemplate() {
    return createTravelCostTemplate(this._travelPoints);
  }
  updatePoints(travelPoints) {
    this._travelPoints = travelPoints;
    this.getElement().querySelector(`.trip-info__cost-value`).textContent = calculateTotalCost(this._travelPoints);
  }
}
