import {makeFirstSymbolUppercase, formatTime, formatDateDifference, formatTimeforDatetime, findCorrectPrepostion} from '../utils/common.js';
import AbstractComponent from './abstract-component.js';

const OFFER_VIEW_COUNT = 3;
const createOffersList = (checkedOffers) => {
  return checkedOffers.slice(0, OFFER_VIEW_COUNT).map((it) => {
    const {title, price} = it;
    return `<li class="event__offer">
                        <span class="event__offer-title">${title}</span>
                        &plus;
                        &euro;&nbsp;<span class="event__offer-price">${price}</span>
                       </li>`;
  }).join(`\n`);


};

const createTravelPointTemplate = (travelPoint) => {
  const {type, destination, departureDate, arrivalDate, price, checkedOffers} = travelPoint;
  const departureTime = formatTime(departureDate);
  const arrivalTime = formatTime(arrivalDate);
  const travelTime = formatDateDifference(arrivalDate - departureDate);
  const departureDatetime = formatTimeforDatetime(departureDate);
  const arrivalDatetime = formatTimeforDatetime(arrivalDate);
  const preposition = findCorrectPrepostion(type);
  return (
    `<li class="trip-events__item">
                  <div class="event">
                    <div class="event__type">
                      <img class="event__type-icon" width="42" height="42" src="img/icons/${type}.png" alt="Event type icon">
                    </div>
                    <h3 class="event__title">${makeFirstSymbolUppercase(type)} ${preposition} ${destination}</h3>

                    <div class="event__schedule">
                      <p class="event__time">
                        <time class="event__start-time" datetime="${departureDatetime}">${departureTime}</time>
                        &mdash;
                        <time class="event__end-time" datetime="${arrivalDatetime}">${arrivalTime}</time>
                      </p>
                      <p class="event__duration">${travelTime}</p>
                    </div>

                    <p class="event__price">
                      &euro;&nbsp;<span class="event__price-value">${price}</span>
                    </p>
                    ${checkedOffers.length > 0 ? `
                    <h4 class="visually-hidden">Offers:</h4>
                    <ul class="event__selected-offers">
                      ${createOffersList(checkedOffers)}
                    </ul>
                     ` : ``}
                    <button class="event__rollup-btn" type="button">
                      <span class="visually-hidden">Open event</span>
                    </button>
                    
                  </div>
                </li>`
  );
};

export default class TravelPoint extends AbstractComponent {
  constructor(travelPoint) {
    super();

    this._travelPoint = travelPoint;
  }

  getTemplate() {
    return createTravelPointTemplate(this._travelPoint);
  }
  setEditButtonClickHandler(handler) {
    this.getElement().querySelector(`button`)
      .addEventListener(`click`, handler);
  }
}
