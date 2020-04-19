import {formatDatePeriod} from '../utils/common.js';
import AbstractComponent from './abstract-component.js';

const createTravelPointsInfo = (points) => {
  let uniquePoints = [points[0].destination];
  for (const point of points.slice(1)) {
    if (point !== uniquePoints[uniquePoints.length - 1]) {
      uniquePoints.push(point.destination);
    }
  }
  return (uniquePoints.length > 3) ? `${points[0].destination} &mdash; ... &mdash; ${points[points.length - 1].destination}` : uniquePoints.join(` &mdash; `);

};
const createTravelInfoTemplate = (points) => {
  const pointsInfo = (points.length > 0) ? createTravelPointsInfo(points) : ``;
  const datePeriodInfo = (points.length > 0) ? formatDatePeriod(points[0].departureDate, points[points.length - 1].arrivalDate) : ``;
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
  constructor(travelPoints) {
    super();

    this._travelPoints = travelPoints;
  }
  getTemplate() {
    return createTravelInfoTemplate(this._travelPoints);
  }
}
