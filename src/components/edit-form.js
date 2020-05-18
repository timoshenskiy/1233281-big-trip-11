import {POINT_TYPES_TRANSFER, POINT_TYPES_ACTIVITY} from '../const.js';
import {makeFirstSymbolUppercase, formatTimeforInput, findCorrectPrepostion} from '../utils/common.js';
import AbstractSmartComponent from './abstract-smart-component.js';
import {Mode} from "../controllers/point-controller.js";
import {encode} from "he";
import flatpickr from "flatpickr";

import "flatpickr/dist/flatpickr.min.css";

const DefaultButtonText = {
  SAVE: `Save`,
  DELETE: `Delete`,
  CANCEL: `Cancel`,
};
const NotificationText = {
  SAVING: `Saving...`,
  DELETING: `Deleting...`
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
const createEventOfferItems = (type, checkedOffers, allOffers) => {
  let offersOfCurrentType = [];
  for (const offersOfOneType of allOffers) {
    if (offersOfOneType.type === type) {
      offersOfCurrentType = offersOfOneType.offers;
    }
  }
  return offersOfCurrentType.map((offer, index) => {
    const {title, price} = offer;
    const isChecked = checkedOffers.some((it) => {
      return (it.title === title && it.price === price);
    });
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
    return `<img class="event__photo" src="${it.src}" alt="${it.description}">`;
  }).join(`\n`);
};

const createOptionsTemplate = (pointDestinations) => {
  const destinationsNames = [];
  pointDestinations.forEach((it)=>{
    destinationsNames.push(it.name);
  });
  return destinationsNames.map((it) => {
    return (
      `<option value="${it}"></option>`);
  })
  .join(`\n`);

};


const createEditFormTemplate = (travelPoint, options) => {
  const {price, departureDate, arrivalDate, isFavorite} = travelPoint;
  const {mode, type, destination: notSanitizedDestination, description, photos, allOffers, destinations, checkedOffers} = options;

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
                  ${createOptionsTemplate(destinations)}
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

              <button class="event__save-btn  btn  btn--blue" type="submit">${DefaultButtonText.SAVE}</button>
              <button class="event__reset-btn" type="reset">${mode === Mode.ADDING ? DefaultButtonText.CANCEL : DefaultButtonText.DELETE}</button>
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
            ${allOffers.length > 0 ? `
              <section class="event__section  event__section--offers">
                <h3 class="event__section-title  event__section-title--offers">Offers</h3>

                <div class="event__available-offers">
                  ${createEventOfferItems(type, checkedOffers, allOffers)}
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
  constructor(travelPoint, mode, offers, destinations) {
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

    this._offers = offers;
    this._destinations = destinations;

    this._flatpickrDeparture = null;
    this._flatpickrArrival = null;

    this._subscribeOnEvents();


    this._applyFlatpickr();

    this._submitHandler = null;
    this._favoritesHandler = null;
    this._editCloseHandler = null;
    this._deleteHandler = null;

    this._didErrorOccur = false;

  }

  getTemplate() {
    return createEditFormTemplate(this._travelPoint, {
      mode: this._mode,
      type: this._type,
      destination: this._destination,
      description: this._description,
      photos: this._photos,
      allOffers: this._offers,
      destinations: this._destinations,
      checkedOffers: this._checkedOffers,
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

        this.rerender();
      });
    }
    const inputDestination = element.querySelector(`.event__input--destination`);
    const submitButton = element.querySelector(`.event__save-btn`);
    inputDestination.addEventListener(`change`, (evt) => {
      const isCorrectValue = this._destinations.some((it)=>(it.name === evt.target.value));
      if (isCorrectValue) {
        this._destination = evt.target.value;
        for (const placeInfo of this._destinations) {
          submitButton.disabled = false;
          if (placeInfo.name === evt.target.value) {
            this._description = placeInfo.description;
            this._photos = placeInfo.pictures;
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
    return {
      id: this._travelPoint.id,
      isFavorite: this._travelPoint.isFavorite,
      formData: new FormData(form),
    };
  }
  showNotificationAboutSaving() {
    this.getElement().querySelector(`.event__save-btn`).textContent = NotificationText.SAVING;
  }
  removeNotificationAboutSaving() {
    this.getElement().querySelector(`.event__save-btn`).textContent = DefaultButtonText.SAVE;
  }
  showNotificationAboutDeleting() {
    this.getElement().querySelector(`.event__reset-btn`).textContent = NotificationText.DELETING;
  }
  removeNotificationAboutDeleting() {
    if (this._mode === Mode.ADDING) {
      this.getElement().querySelector(`.event__reset-btn`).textContent = DefaultButtonText.CANCEL;
    } else {
      this.getElement().querySelector(`.event__reset-btn`).textContent = DefaultButtonText.DELETE;
    }
  }
  checkForErrors() {
    return this._didErrorOccur;
  }
  addErrorStyle() {
    this.getElement().classList.add(`error`);
    this._didErrorOccur = true;
  }
  removeErrorStyle() {
    this.getElement().classList.remove(`error`);
    this._didErrorOccur = false;
  }
  toggleFavoriteState() {
    const favoriteButton = this.getElement().querySelector(`.event__favorite-checkbox`);
    favoriteButton.checked = !favoriteButton.checked;
  }
  blockForm() {
    this.getElement().querySelectorAll(`button`).forEach((it) => {
      it.disabled = true;
    });
    this.getElement().querySelectorAll(`input`).forEach((it) => {
      it.disabled = true;
    });
  }
  unblockForm() {
    this.getElement().querySelectorAll(`button`).forEach((it) => {
      it.disabled = false;
    });
    this.getElement().querySelectorAll(`input`).forEach((it) => {
      it.disabled = false;
    });
  }
  removeFlatpickr() {
    this._flatpickrDeparture.destroy();
    this._flatpickrDeparture = null;

    this._flatpickrArrival.destroy();
    this._flatpickrArrival = null;

  }
}
