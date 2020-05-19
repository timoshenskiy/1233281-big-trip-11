import AbstractSmartComponent from "./abstract-smart-component.js";

export const SortType = {
  EVENT: `event`,
  TIME: `time`,
  PRICE: `price`,

};

const createSortTemplate = (sortType) => {
  return (
    `<form class="trip-events__trip-sort  trip-sort" action="#" method="get">
            <span class="trip-sort__item  trip-sort__item--day">${sortType === SortType.EVENT ? `DAY` : ``}</span>

            <div class="trip-sort__item  trip-sort__item--event">
              <input id="sort-event" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="sort-event" ${sortType === SortType.EVENT ? `checked` : ``}>
              <label data-sort-type="${SortType.EVENT}"  class="trip-sort__btn" for="sort-event">Event</label>
            </div>

            <div class="trip-sort__item  trip-sort__item--time">
              <input id="sort-time" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="sort-time" ${sortType === SortType.TIME ? `checked` : ``}>
              <label data-sort-type="${SortType.TIME}" class="trip-sort__btn  trip-sort__btn--active  trip-sort__btn--by-increase" for="sort-time">
                Time
              </label>
            </div>

            <div class="trip-sort__item  trip-sort__item--price">
              <input id="sort-price" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="sort-price" ${sortType === SortType.PRICE ? `checked` : ``}>
              <label data-sort-type="${SortType.PRICE}" class="trip-sort__btn" for="sort-price">
                Price
              </label>
            </div>

            <span class="trip-sort__item  trip-sort__item--offers">Offers</span>
          </form>`
  );
};

export default class Sorting extends AbstractSmartComponent {
  constructor(sortType) {
    super();

    this._currentSortType = sortType;
    this._sortTypeChangeHandler = null;
  }
  getTemplate() {
    return createSortTemplate(this._currentSortType);
  }

  getSortType() {
    return this._currentSortType;
  }
  setSortTypeChangeHandler(handler) {
    this.getElement().addEventListener(`click`, (evt) => {
      evt.preventDefault();

      if (evt.target.tagName !== `LABEL`) {
        return;
      }

      const sortType = evt.target.dataset.sortType;
      if (this._currentSortType === sortType) {
        return;
      }

      this._currentSortType = sortType;
      this.refreshElement(sortType, handler);
      handler(this._currentSortType);
    });
  }

  refreshElement(sortType, handler) {
    this._currentSortType = sortType;
    this._sortTypeChangeHandler = handler;

    this.rerender();
  }
  setDefault() {
    this.refreshElement(SortType.EVENT, this._sortTypeChangeHandler);
  }
  recoveryListeners() {
    this.setSortTypeChangeHandler(this._sortTypeChangeHandler);

  }
}
