import {formatDatePeriod} from '../utils.js';

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
  return (
    `<section class="trip-main__trip-info  trip-info">
            <div class="trip-info__main">
              <h1 class="trip-info__title">${createTravelPointsInfo(points)}</h1>

              <p class="trip-info__dates">${formatDatePeriod(points[0].departureDate, points[points.length - 1].arrivalDate)}</p>
            </div>

     </section>`
  );
};

export {createTravelInfoTemplate};
