import {createTravelInfoTemplate} from './components/travel-info.js';
import {createTravelCostTemplate} from './components/travel-cost.js';
import {createSiteMenuTemplate} from './components/site-menu.js';
import {createFiltersTemplate} from './components/filters.js';
import {createSortTemplate} from './components/sorting.js';
import {createEditFormTemplate} from './components/edit-form.js';
import {createTravelPointListTemplate} from './components/travel-point-list.js';
import {createTravelPointTemplate} from './components/travel-point.js';
import {generateTravelPoints} from './mock/point.js';

const TRAVEL_POINT_COUNT = 20;

const points = generateTravelPoints(TRAVEL_POINT_COUNT);
points.sort((a, b) => {
  return a.departureDate - b.departureDate;
});
let totalCost = 0;
for (const point of points) {
  let offersCost = 0;
  if (point.checkedOffers.length > 0) {
    offersCost = point.checkedOffers.reduce((sum, it) =>{
      return sum + it.price;
    }, 0);
  }
  totalCost += point.price + offersCost;
}


// Функция отрисовки переданного в нее шаблона в указанное место
const render = (container, template, place) => {
  container.insertAdjacentHTML(place, template);
};
// Добавляем информацию о маршруте, цену, меню и фильтры (шапка)
const siteHeaderElement = document.querySelector(`.trip-main`);
render(siteHeaderElement, createTravelInfoTemplate(points), `afterbegin`);
const tripCostElement = siteHeaderElement.querySelector(`.trip-info`);
render(tripCostElement, createTravelCostTemplate(totalCost), `beforeend`);
const menuElement = siteHeaderElement.querySelector(`.trip-controls h2`);
render(menuElement, createSiteMenuTemplate(), `afterend`);
const filterElement = siteHeaderElement.querySelector(`.trip-controls`);
render(filterElement, createFiltersTemplate(), `beforeend`);
// Добавляем сортировку, форму, список для точек маршрута, сами точки (основное содержимое)
const siteMainElement = document.querySelector(`.trip-events`);
render(siteMainElement, createSortTemplate(), `beforeend`);
render(siteMainElement, createEditFormTemplate(points[0]), `beforeend`);


let currentDate = points[0].departureDate;
let dayNumber = 1;
render(siteMainElement, createTravelPointListTemplate(dayNumber, points[0].departureDate), `beforeend`);
for (const point of points) {
  if (!(currentDate.getMonth() === point.departureDate.getMonth() && currentDate.getDate() === point.departureDate.getDate())) {
    dayNumber++;
    render(siteMainElement, createTravelPointListTemplate(dayNumber, point.departureDate), `beforeend`);
  }
  currentDate = point.departureDate;
  point.dayNumber = dayNumber;
  const pointList = siteMainElement.querySelector(`.trip-days:last-child .trip-events__list`);

  render(pointList, createTravelPointTemplate(point), `beforeend`);

}
