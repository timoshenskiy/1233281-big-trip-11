import Point from "./models/point.js";
import Offers from "./models/offers.js";
import Destinations from "./models/destinations.js";

const checkStatus = (response) => {
  if (response.status >= 200 && response.status < 300) {
    return response;
  } else {
    throw new Error(`${response.status}: ${response.statusText}`);
  }
};

const API = class {
  constructor(authorization) {
    this._authorization = authorization;
  }
  getPoints() {
    const headers = new Headers();
    headers.append(`Authorization`, this._authorization);

    return fetch(`https://11.ecmascript.pages.academy/big-trip/points`, {headers})
        .then(checkStatus)
        .then((response) => response.json())
        .then(Point.parsePoints);
  }
  getOffers() {
    const headers = new Headers();
    headers.append(`Authorization`, this._authorization);

    return fetch(`https://11.ecmascript.pages.academy/big-trip/offers`, {headers})
        .then(checkStatus)
        .then((response) => response.json())
        .then(Offers.parseOffers);
  }
  getDestinations() {
    const headers = new Headers();
    headers.append(`Authorization`, this._authorization);

    return fetch(`https://11.ecmascript.pages.academy/big-trip/destinations`, {headers})
        .then(checkStatus)
        .then((response) => response.json())
        .then(Destinations.parseDestinations);
  }
  updatePoint(id, data) {
    const headers = new Headers();
    headers.append(`Authorization`, this._authorization);
    headers.append(`Content-Type`, `application/json`);
    return fetch(`https://11.ecmascript.pages.academy/big-trip/points/${id}`, {
      method: `PUT`,
      headers,
      body: JSON.stringify(data.toRAW()),
    })
      .then(checkStatus)
      .then((response) => response.json())
      .then(Point.parsePoint);
  }
};

export default API;
