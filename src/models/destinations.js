export default class Destinations {
  constructor(data) {
    this._destinations = data;
  }
  static parseDestinations(data) {
    return new Destinations(data);
  }
  getDestinations() {
    return this._destinations;
  }
}
