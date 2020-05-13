import {formatDatePeriod} from '../utils/common.js';
import AbstractComponent from './abstract-component.js';
import {sortTravelPoints} from '../controllers/trip-controller.js';
import {SortType} from '../components/sorting.js';

const createTravelPointsInfo = (points) => {
  let uniquePoints = [points[0].destination];
  for (const point of points.slice(1)) {
    if (point !== uniquePoints[uniquePoints.length - 1]) {
      uniquePoints.push(point.destination);
    }
  }
  return (uniquePoints.length > 3) ? `${points[0].destination} &mdash; ... &mdash; ${points[points.length - 1].destination}` : uniquePoints.join(` &mdash; `);

};
const getPointsInfo = (sortedPoints) => {
  return (sortedPoints.length > 0) ? createTravelPointsInfo(sortedPoints) : ``;
};
const getDatePeriodInfo = (sortedPoints) => {
  return (sortedPoints.length > 0) ? formatDatePeriod(sortedPoints[0].departureDate, sortedPoints[sortedPoints.length - 1].arrivalDate) : ``;
};

const createTravelInfoTemplate = (points) => {
  const sortedPoints = points.slice();
  sortTravelPoints(SortType.EVENT, sortedPoints);
  const pointsInfo = getPointsInfo(sortedPoints);
  const datePeriodInfo = getDatePeriodInfo(sortedPoints);
  return (
    `<section class="trip-main__trip-info  trip-info">
            <div class="trip-info__main">
              <h1 class="trip-info__title">${pointsInfo}</h1>

              <p class="trip-info__dates">${datePeriodInfo}</p>
            </div>

     </section>`
  );
};

export default class TravelInfo extends AbstractComponent {
  constructor(pointsModel) {
    super();

    this.pointsModel = pointsModel;
    this._travelPoints = pointsModel.getAllPoints();
  }
  getTemplate() {
    return createTravelInfoTemplate(this._travelPoints);
  }
  updatePoints(travelPoints) {
    this._travelPoints = travelPoints;
    const sortedPoints = this._travelPoints.slice();
    sortTravelPoints(SortType.EVENT, sortedPoints);
    this.getElement().querySelector(`.trip-info__title`).innerHTML = getPointsInfo(sortedPoints);
    this.getElement().querySelector(`.trip-info__dates`).innerHTML = getDatePeriodInfo(sortedPoints);
  }
}
