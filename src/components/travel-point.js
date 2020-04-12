import {makeFirstSymbolUppercase, formatTime, formatDateDifference, formatTimeforDatetime} from '../utils.js';

const OFFER_VIEW_COUNT = 3;
const createOffersList = (offers) => {
  return offers.slice(0, OFFER_VIEW_COUNT).map((it) => {
    const {title, price, isChecked} = it;
    return isChecked ? `<li class="event__offer">
                        <span class="event__offer-title">${title}</span>
                        &plus;
                        &euro;&nbsp;<span class="event__offer-price">${price}</span>
                       </li>` : ``;
  }).join(`\n`);


};

const createTravelPointTemplate = (point) => {
  const {pointType, preposition, destination, departureDate, arrivalDate, eventPrice, offers} = point;
  const departureTime = formatTime(departureDate);
  const arrivalTime = formatTime(arrivalDate);
  const travelTime = formatDateDifference(arrivalDate - departureDate);
  const departureDatetime = formatTimeforDatetime(departureDate);
  const arrivalDatetime = formatTimeforDatetime(arrivalDate);
  return (
    `<li class="trip-events__item">
                  <div class="event">
                    <div class="event__type">
                      <img class="event__type-icon" width="42" height="42" src="img/icons/${pointType}.png" alt="Event type icon">
                    </div>
                    <h3 class="event__title">${makeFirstSymbolUppercase(pointType)} ${preposition} ${destination}</h3>

                    <div class="event__schedule">
                      <p class="event__time">
                        <time class="event__start-time" datetime="${departureDatetime}">${departureTime}</time>
                        &mdash;
                        <time class="event__end-time" datetime="${arrivalDatetime}">${arrivalTime}</time>
                      </p>
                      <p class="event__duration">${travelTime}</p>
                    </div>

                    <p class="event__price">
                      &euro;&nbsp;<span class="event__price-value">${eventPrice}</span>
                    </p>
                    ${offers.length > 0 ? `
                    <h4 class="visually-hidden">Offers:</h4>
                    <ul class="event__selected-offers">
                      ${createOffersList(offers)}
                    </ul>
                     ` : ``}
                    <button class="event__rollup-btn" type="button">
                      <span class="visually-hidden">Open event</span>
                    </button>
                    
                  </div>
                </li>`
  );
};

export {createTravelPointTemplate};
