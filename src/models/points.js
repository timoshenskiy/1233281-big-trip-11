import {getPointsByFilter} from "../utils/filters.js";
import {FilterType} from "../const.js";

export default class Points {
  constructor() {
    this._travelPoints = [];

    this._activeFilterType = FilterType.EVERYTHING;
    this._dataChangeHandlers = [];
    this._filterChangeHandlers = [];
  }

  getPoints() {
    return getPointsByFilter(this._travelPoints, this._activeFilterType);
  }
  getAllPoints() {
    return this._travelPoints;
  }

  setPoints(travelPoints) {
    this._travelPoints = Array.from(travelPoints);
    this._callHandlers(this._dataChangeHandlers);
  }
  setFilter(filterType) {
    this._activeFilterType = filterType;

    this._callHandlers(this._filterChangeHandlers);
  }
  updatePoint(id, travelPoint) {
    const index = this._travelPoints.findIndex((it) => it.id === id);

    if (index === -1) {
      return false;
    }

    this._travelPoints = [].concat(this._travelPoints.slice(0, index), travelPoint, this._travelPoints.slice(index + 1));

    this._callHandlers(this._dataChangeHandlers);

    return true;
  }
  addPoint(travelPoint) {
    this._travelPoints = [].concat(travelPoint, this._travelPoints);
    this._callHandlers(this._dataChangeHandlers);
  }
  removePoint(id) {
    const index = this._travelPoints.findIndex((it) => it.id === id);

    if (index === -1) {
      return false;
    }

    this._travelPoints = [].concat(this._travelPoints.slice(0, index), this._travelPoints.slice(index + 1));

    this._callHandlers(this._dataChangeHandlers);

    return true;
  }

  setFilterChangeHandler(handler) {
    this._filterChangeHandlers.push(handler);
  }

  setDataChangeHandler(handler) {
    this._dataChangeHandlers.push(handler);
  }
  getActiveFilterType() {
    return this._activeFilterType;
  }

  _callHandlers(handlers) {
    handlers.forEach((handler) => handler());
  }
}
