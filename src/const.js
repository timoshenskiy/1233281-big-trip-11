const pointTypesTransfer = [`taxi`, `bus`, `train`, `ship`, `transport`, `drive`, `flight`];
const pointTypesActivity = [`check-in`, `sightseeing`, `restaurant`];
const pointDestinations = [`Moscow`, `Kazan`, `Zelenograd`, `Vladivostok`, `Tver`, `London`, `New-York`, `Paris`];
const pointDescriptions = [`Lorem ipsum dolor sit amet, consectetur adipiscing elit. `,
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
  price: 100,
  isChecked: Math.random() > 0.7 ? true : false,
}, {
  type: `flight`,
  title: `Add luggage`,
  price: 30,
  isChecked: Math.random() > 0.7 ? true : false,
}, {
  type: `flight`,
  title: `Switch to comfort class`,
  price: 100,
  isChecked: Math.random() > 0.7 ? true : false,
}, {
  type: `check-in`,
  title: `Add Meal`,
  price: 15,
  isChecked: Math.random() > 0.7 ? true : false,
}, {
  type: `train`,
  title: `Choose seats`,
  price: 5,
  isChecked: Math.random() > 0.7 ? true : false,
}, {
  type: `transport`,
  title: `Travel by train`,
  price: 40,
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
export {pointTypesTransfer, pointTypesActivity, pointDestinations, pointDescriptions, pointOffers, MONTH_NAMES};
