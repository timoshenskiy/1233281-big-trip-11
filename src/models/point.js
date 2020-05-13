
export default class Point {
  constructor(data) {
    this.id = data[`id`];
    this.type = data[`type`];
    this.destination = data[`destination`][`name`];
    this.departureDate = new Date(data[`date_from`]);
    this.arrivalDate = new Date(data[`date_to`]);
    this.price = data[`base_price`];
    this.photos = data[`destination`][`pictures`];
    this.description = data[`destination`][`description`];
    this.checkedOffers = data[`offers`];
    this.isFavorite = data[`is_favorite`];
  }

  static parsePoint(data) {
    return new Point(data);
  }

  static parsePoints(data) {
    return data.map(Point.parsePoint);
  }
  toRAW() {
    return {
      "base_price": this.price,
      "date_from": this.departureDate.toISOString(),
      "date_to": this.arrivalDate.toISOString(),
      "destination": {
        "description": this.description,
        "name": this.destination,
        "pictures": this.photos,
      },
      "id": this.id,
      "is_favorite": this.isFavorite,
      "offers": this.checkedOffers,
      "type": this.type,
    };
  }
  static clone(data) {
    return new Point(data.toRAW());
  }
}
