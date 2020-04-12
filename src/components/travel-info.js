import {formatDatePeriod} from '../utils.js';


const createTravelInfoTemplate = (points) => {
  let travelInfo = [];
  for (const point of points) {
    if (point.destination !== travelInfo[travelInfo.length - 1]) {
      travelInfo.push(point.destination);
    }
  }
  travelInfo = travelInfo.join(` &mdash; `);
  return (
    `<section class="trip-main__trip-info  trip-info">
            <div class="trip-info__main">
              <h1 class="trip-info__title">${travelInfo}</h1>

              <p class="trip-info__dates">${formatDatePeriod(points[0].departureDate, points[points.length - 1].arrivalDate)}</p>
            </div>

     </section>`
  );
};

export {createTravelInfoTemplate};
