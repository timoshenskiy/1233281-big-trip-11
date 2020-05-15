export default class Offers {
  constructor(data) {
    this._offers = data;
  }
  static parseOffers(data) {
    return new Offers(data);
  }
  getOffers() {
    return this._offers;
  }
}
