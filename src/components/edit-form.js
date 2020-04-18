import {POINT_TYPES_TRANSFER, POINT_TYPES_ACTIVITY} from '../const.js';
import {makeFirstSymbolUppercase, formatTimeforInput} from '../utils/common.js';
import AbstractComponent from './abstract-component.js';

const createEventTypeItems = (eventTypes, checkedType) => {
  return eventTypes.map((eventType, index) => {
    let isChecked = false;
    if (eventType === checkedType) {
      isChecked = true;
    }
    return (
      `<div class="event__type-item">
                      <input id="event-type-${eventType}-${index + 1}" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${eventType}" ${isChecked ? `checked` : ``}>
                      <label class="event__type-label  event__type-label--${eventType}" for="event-type-${eventType}-${index + 1}">${makeFirstSymbolUppercase(eventType)}</label>
                    </div>`);
  })
  .join(`\n`);
};
const createEventOfferItems = (offers, isChecked = false) => {
  return offers.map((eventOffer, index) => {
    const {type, title, price} = eventOffer;
    return (
      `<div class="event__offer-selector">
                    <input class="event__offer-checkbox  visually-hidden" id="event-offer-${type}-${index + 1}" type="checkbox" name="event-offer-${type}" ${isChecked ? `checked` : ``}>
                    <label class="event__offer-label" for="event-offer-${type}-${index + 1}">
                      <span class="event__offer-title">${title}</span>
                      &plus;
                      &euro;&nbsp;<span class="event__offer-price">${price}</span>
                    </label>
                  </div>`);
  })
  .join(`\n`);

};

const createPhotoMarkup = (photos) => {
  return photos.map((it) => {
    return `<img class="event__photo" src="${it}" alt="Event photo">`;
  }).join(`\n`);
};


const createEditFormTemplate = (travelPoint) => {
  const {type, preposition, destination, checkedOffers, uncheckedOffers, price, description, photos, departureDate, arrivalDate} = travelPoint;
  const startTime = formatTimeforInput(departureDate);
  const endTime = formatTimeforInput(arrivalDate);
  return (
    `<form class="trip-events__item  event  event--edit" action="#" method="post">
            <header class="event__header">
              <div class="event__type-wrapper">
                <label class="event__type  event__type-btn" for="event-type-toggle-1">
                  <span class="visually-hidden">Choose event type</span>
                  <img class="event__type-icon" width="17" height="17" src="img/icons/${type}.png" alt="Event type icon">
                </label>
                <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">

                <div class="event__type-list">
                  <fieldset class="event__type-group">
                    <legend class="visually-hidden">Transfer</legend>
                    ${createEventTypeItems(POINT_TYPES_TRANSFER, type)}
                  </fieldset>

                  <fieldset class="event__type-group">
                    <legend class="visually-hidden">Activity</legend>
                    ${createEventTypeItems(POINT_TYPES_ACTIVITY, type)}
                  </fieldset>
                </div>
              </div>

              <div class="event__field-group  event__field-group--destination">
                <label class="event__label  event__type-output" for="event-destination-1">
                  ${makeFirstSymbolUppercase(type)} ${preposition}
                </label>
                <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${destination}" list="destination-list-1">
                <datalist id="destination-list-1">
                  <option value="Amsterdam"></option>
                  <option value="Geneva"></option>
                  <option value="Chamonix"></option>
                  <option value="Saint Petersburg"></option>
                </datalist>
              </div>

              <div class="event__field-group  event__field-group--time">
                <label class="visually-hidden" for="event-start-time-1">
                  From
                </label>
                <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${startTime}">
                &mdash;
                <label class="visually-hidden" for="event-end-time-1">
                  To
                </label>
                <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${endTime}">
              </div>

              <div class="event__field-group  event__field-group--price">
                <label class="event__label" for="event-price-1">
                  <span class="visually-hidden">Price</span>
                  &euro;
                </label>
                <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="${price}">
              </div>

              <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
              <button class="event__reset-btn" type="reset">Cancel</button>
            </header>
            <section class="event__details">
            ${checkedOffers.length > 0 || uncheckedOffers > 0 ? `
              <section class="event__section  event__section--offers">
                <h3 class="event__section-title  event__section-title--offers">Offers</h3>

                <div class="event__available-offers">
                  ${createEventOfferItems(checkedOffers, true)}
                  ${createEventOfferItems(uncheckedOffers)}
                </div>
              </section>` : ``}
              <section class="event__section  event__section--destination">
                <h3 class="event__section-title  event__section-title--destination">Destination</h3>
                <p class="event__destination-description">${description}</p>

                <div class="event__photos-container">
                  <div class="event__photos-tape">
                    ${createPhotoMarkup(photos)}
                  </div>
                </div>
              </section>
            </section>
          </form>`
  );
};


export default class EditForm extends AbstractComponent {
  constructor(travelPoint) {
    super();

    this._travelPoint = travelPoint;
  }

  getTemplate() {
    return createEditFormTemplate(this._travelPoint);
  }
  setSubmitHandler(handler) {
    this.getElement().addEventListener(`submit`, handler);
  }
}
