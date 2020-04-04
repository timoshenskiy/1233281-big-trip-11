import {createTravelInfoTemplate} from './components/travel-info.js';
import {createTravelCostTemplate} from './components/travel-cost.js';
import {createSiteMenuTemplate} from './components/site-menu.js';
import {createFiltersTemplate} from './components/filters.js';
import {createSortTemplate} from './components/sorting.js';
import {createEditFormTemplate} from './components/form.js';
import {createTravelPointListTemplate} from './components/travel-point-list.js';
import {createTravelPointTemplate} from './components/travel-point.js';

const TRAVEL_POINT_COUNT = 3;
// Функция отрисовки переданного в нее шаблона в указанное место
const render = (container, template, place) => {
  container.insertAdjacentHTML(place, template);
};
// Добавляем информацию о маршруте, цену, меню и фильтры (шапка)
const siteHeaderElement = document.querySelector(`.trip-main`);
render(siteHeaderElement, createTravelInfoTemplate(), `afterbegin`);
const tripCostElement = siteHeaderElement.querySelector(`.trip-info`);
render(tripCostElement, createTravelCostTemplate(), `beforeend`);
const menuElement = siteHeaderElement.querySelector(`.trip-controls h2`);
render(menuElement, createSiteMenuTemplate(), `afterend`);
const filterElement = siteHeaderElement.querySelector(`.trip-controls`);
render(filterElement, createFiltersTemplate(), `beforeend`);
// Добавляем сортировку, форму, список для точек маршрута, сами точки (основное содержимое)
const siteMainElement = document.querySelector(`.trip-events`);
render(siteMainElement, createSortTemplate(), `beforeend`);
render(siteMainElement, createEditFormTemplate(), `beforeend`);
render(siteMainElement, createTravelPointListTemplate(), `beforeend`);
const pointList = siteMainElement.querySelector(`.trip-events__list`);
for (let i = 0; i < TRAVEL_POINT_COUNT; i++) {
  render(pointList, createTravelPointTemplate(), `beforeend`);
}
