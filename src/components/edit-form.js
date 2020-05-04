import {POINT_TYPES_TRANSFER, POINT_TYPES_ACTIVITY, POINT_DESTINATIONS} from '../const.js';
import {makeFirstSymbolUppercase, formatTimeforInput, findCorrectPrepostion} from '../utils/common.js';
import AbstractSmartComponent from './abstract-smart-component.js';
import {placesInfo} from "../mock/place-info.js";
import {offersForEvents} from "../mock/offers.js";
import {Mode} from "../controllers/point.js";
import {encode} from "he";
import flatpickr from "flatpickr";

import "flatpickr/dist/flatpickr.min.css";


const parseFormData = (formData, form) => {
  const offers = Array.from(form.querySelectorAll(`.event__offer-selector`));
  const allCheckedOffers = offers.filter((it)=>(it.querySelector(`input`).checked)).map((it)=>{
    return ({
      title: it.querySelector(`.event__offer-title`).textContent,
      price: +it.querySelector(`.event__offer-price`).textContent,
    });
  }
  );
  const allUncheckedOffers = offers.filter((it)=>(!it.querySelector(`input`).checked)).map((it)=>{
    return ({
      title: it.querySelector(`.event__offer-title`).textContent,
      price: +it.querySelector(`.event__offer-price`).textContent,
    });
  }
  );

  return ({
    type: formData.get(`event-type`),
    destination: formData.get(`event-destination`),
    departureDate: new Date(formData.get(`event-start-time`)),
    arrivalDate: new Date(formData.get(`event-end-time`)),
    price: +formData.get(`event-price`),
    checkedOffers: allCheckedOffers,
    uncheckedOffers: allUncheckedOffers,
  });
};

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
const createEventOfferItems = (type, offers, isChecked, idStep) => {
  return offers.map((eventOffer, index) => {
    const {title, price} = eventOffer;
    return (
      `<div class="event__offer-selector">
                    <input class="event__offer-checkbox  visually-hidden" id="event-offer-${type}-${idStep + index + 1}" type="checkbox" name="event-offer-${type}" ${isChecked ? `checked` : ``}>
                    <label class="event__offer-label" for="event-offer-${type}-${idStep + index + 1}">
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

const createOptionsTemplate = (pointDestinations) => {
  return pointDestinations.map((it) => {
    return (
      `<option value="${it}"></option>`);
  })
  .join(`\n`);

};


const createEditFormTemplate = (travelPoint, options) => {
  const {price, departureDate, arrivalDate, isFavorite} = travelPoint;
  const {mode, type, destination: notSanitizedDestination, description, photos, checkedOffers, uncheckedOffers} = options;

  const destination = encode(notSanitizedDestination);

  const preposition = findCorrectPrepostion(type);
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
                  ${createOptionsTemplate(POINT_DESTINATIONS)}
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
                <input class="event__input  event__input--price" id="event-price-1" type="number" name="event-price" value="${price}">
              </div>

              <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
              <button class="event__reset-btn" type="reset">${mode === Mode.ADDING ? `Cancel` : `Delete`}</button>
              ${mode === Mode.ADDING ? `` : ` <input id="event-favorite-1" class="event__favorite-checkbox  visually-hidden" type="checkbox" name="event-favorite" ${isFavorite ? `checked` : ``}>
              <label class="event__favorite-btn" for="event-favorite-1">
                <span class="visually-hidden">Add to favorite</span>
                <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
                  <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"/>
                </svg>
              </label>
              <button class="event__rollup-btn" type="button">
                <span class="visually-hidden">Open event</span>
              </button>`}
            </header>
            <section class="event__details">
            ${checkedOffers.length > 0 || uncheckedOffers.length > 0 ? `
              <section class="event__section  event__section--offers">
                <h3 class="event__section-title  event__section-title--offers">Offers</h3>

                <div class="event__available-offers">
                  ${createEventOfferItems(type, checkedOffers, true, 0)}
                  ${createEventOfferItems(type, uncheckedOffers, false, checkedOffers.length)}
                </div>
              </section>` : ``}
              ${mode === Mode.ADDING ? `` : `
              <section class="event__section  event__section--destination">
                <h3 class="event__section-title  event__section-title--destination">Destination</h3>
                <p class="event__destination-description">${description}</p>

                <div class="event__photos-container">
                  <div class="event__photos-tape">
                    ${createPhotoMarkup(photos)}
                  </div>
                </div>`}
              </section> 
            </section>
          </form>`
  );
};


export default class EditForm extends AbstractSmartComponent {
  constructor(travelPoint, mode) {
    super();

    this._travelPoint = travelPoint;
    this._mode = mode;
    this._type = travelPoint.type;
    this._departureDate = travelPoint.departureDate;
    this._arrivalDate = travelPoint.arrivalDate;
    this._destination = travelPoint.destination;
    this._description = travelPoint.description;
    this._photos = travelPoint.photos;
    this._checkedOffers = travelPoint.checkedOffers;
    this._uncheckedOffers = travelPoint.uncheckedOffers;
    this._subscribeOnEvents();
    this._applyFlatpickr();

    this._flatpickrDeparture = null;
    this._flatpickrArrival = null;
    this._submitHandler = null;
    this._favoritesHandler = null;
    this._editCloseHandler = null;
    this._deleteHandler = null;

  }

  getTemplate() {
    return createEditFormTemplate(this._travelPoint, {
      mode: this._mode,
      type: this._type,
      destination: this._destination,
      description: this._description,
      photos: this._photos,
      checkedOffers: this._checkedOffers,
      uncheckedOffers: this._uncheckedOffers,
    });
  }
  rerender() {
    super.rerender();

    this._applyFlatpickr();
  }
  reset() {
    const travelPoint = this._travelPoint;

    this._type = travelPoint.type;
    this._destination = travelPoint.destination;
    this._description = travelPoint.description;
    this._photos = travelPoint.photos;
    this._checkedOffers = travelPoint.checkedOffers;
    this._uncheckedOffers = travelPoint.uncheckedOffers;

    this.rerender();
  }
  _applyFlatpickr() {
    if (this._flatpickrDeparture) {
      this._flatpickrDeparture.destroy();
      this._flatpickrDeparture = null;
    }
    if (this._flatpickrArrival) {
      this._flatpickrArrival.destroy();
      this._flatpickrArrival = null;
    }


    const dateElements = this.getElement().querySelectorAll(`.event__input--time`);

    const flatpickrDepartureOptions = {
      altInput: true,
      allowInput: true,
      altFormat: `d/m/y H:i`,
      enableTime: true,
      dateFormat: `M-d-Y H:i`,
      defaultDate: this._departureDate,
    };
    const flatpickrArrivalOptions = Object.assign({}, flatpickrDepartureOptions, {
      defaultDate: this._arrivalDate,
    });

    this._flatpickrDeparture = flatpickr(dateElements[0], flatpickrDepartureOptions);
    this._flatpickrArrival = flatpickr(dateElements[1], flatpickrArrivalOptions);
  }
  recoveryListeners() {
    this.setEditCloseButtonClickHandler(this._editCloseHandler);
    this.setSubmitHandler(this._submitHandler);
    this.setDeleteButtonClickHandler(this._deleteHandler);
    this.setFavoritesButtonClickHandler(this._favoritesHandler);
    this._subscribeOnEvents();

  }
  _subscribeOnEvents() {
    const element = this.getElement();
    const labels = element.querySelectorAll(`.event__type-label`);
    for (const label of labels) {
      label.addEventListener(`click`, (evt) => {
        this._type = evt.target.textContent.toLowerCase();
        this._checkedOffers = [];
        for (const offersForEvent of offersForEvents) {
          if (offersForEvent.type === this._type) {
            this._uncheckedOffers = offersForEvent.list;
          }
        }

        this.rerender();
      });
    }
    const inputDestination = element.querySelector(`.event__input--destination`);
    const submitButton = element.querySelector(`.event__save-btn`);
    inputDestination.addEventListener(`change`, (evt) => {
      const isCorrectValue = placesInfo.some((it)=>(it.name === evt.target.value));
      if (isCorrectValue) {
        this._destination = evt.target.value;
        for (const placeInfo of placesInfo) {
          submitButton.disabled = false;
          if (placeInfo.name === evt.target.value) {
            this._description = placeInfo.description;
            this._photos = placeInfo.photos;
          }
        }
        this.rerender();
      } else {
        submitButton.disabled = true;
        inputDestination.value = ``;
      }
    });

  }
  setFavoritesButtonClickHandler(handler) {
    if (this._mode === `adding`) {
      return;
    }
    this.getElement().querySelector(`.event__favorite-checkbox`)
      .addEventListener(`click`, handler);

    this._favoritesHandler = handler;
  }
  setSubmitHandler(handler) {
    this.getElement().addEventListener(`submit`, handler);

    this._submitHandler = handler;
  }
  setEditCloseButtonClickHandler(handler) {
    if (this._mode === `adding`) {
      return;
    }
    this.getElement().querySelector(`.event__rollup-btn`)
      .addEventListener(`click`, handler);

    this._editCloseHandler = handler;
  }
  setDeleteButtonClickHandler(handler) {
    this.getElement().querySelector(`.event__reset-btn`)
      .addEventListener(`click`, handler);

    this._deleteHandler = handler;
  }
  getData() {
    const form = this.getElement();
    const formData = new FormData(form);
    return parseFormData(formData, form);
  }
}
