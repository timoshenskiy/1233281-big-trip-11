const POINT_TYPES_TRANSFER = [`taxi`, `bus`, `train`, `ship`, `transport`, `drive`, `flight`];
const POINT_TYPES_ACTIVITY = [`check-in`, `sightseeing`, `restaurant`];
const POINT_OFFERS_TITLES = [`Rent a car`, `Add luggage`, `Switch to comfort class`, `Add Meal`, `Choose seats`, `Travel by train`];
const POINT_DESTINATIONS = [`Moscow`, `Kazan`, `Zelenograd`, `Vladivostok`, `Tver`, `London`, `New-York`, `Paris`];
const POINT_DESCRIPTIONS = [`Lorem ipsum dolor sit amet, consectetur adipiscing elit. `,
  `Cras aliquet varius magna, non porta ligula feugiat eget. `,
  `Fusce tristique felis at fermentum pharetra. `,
  `Aliquam id orci ut lectus varius viverra. `,
  `Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante. `,
  `Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum. `,
  `Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui. `,
  `Sed sed nisi sed augue convallis suscipit in sed felis. `,
  `Aliquam erat volutpat. `,
  `Nunc fermentum tortor ac porta dapibus. `,
  `In rutrum ac purus sit amet tempus. `];
const pointOffers = [{
  type: `drive`,
  title: `Rent a car`,
  price: Math.floor((Math.random() * 20)) * 5,
  isChecked: Math.random() > 0.7 ? true : false,
}, {
  type: `flight`,
  title: `Add luggage`,
  price: Math.floor((Math.random() * 20)) * 5,
  isChecked: Math.random() > 0.7 ? true : false,
}, {
  type: `flight`,
  title: `Switch to comfort class`,
  price: Math.floor((Math.random() * 20)) * 5,
  isChecked: Math.random() > 0.7 ? true : false,
}, {
  type: `check-in`,
  title: `Add Meal`,
  price: Math.floor((Math.random() * 20)) * 5,
  isChecked: Math.random() > 0.7 ? true : false,
}, {
  type: `train`,
  title: `Choose seats`,
  price: Math.floor((Math.random() * 20)) * 5,
  isChecked: Math.random() > 0.7 ? true : false,
}, {
  type: `transport`,
  title: `Travel by train`,
  price: Math.floor((Math.random() * 20)) * 5,
  isChecked: Math.random() > 0.7 ? true : false,
}];
const MONTH_NAMES = [
  `Jan`,
  `Feb`,
  `Mar`,
  `Apr`,
  `May`,
  `Jun`,
  `Jul`,
  `Aug`,
  `Sep`,
  `Oct`,
  `Nov`,
  `Dec`,
];
export {POINT_TYPES_TRANSFER, POINT_TYPES_ACTIVITY, POINT_OFFERS_TITLES, POINT_DESTINATIONS, POINT_DESCRIPTIONS, pointOffers, MONTH_NAMES};
