import TravelInfoComponent from './components/travel-info.js';
import TravelCostComponent from './components/travel-cost.js';
import SiteMenuComponent from './components/site-menu.js';
import FilterComponent from './components/filters.js';
import SortComponent from './components/sorting.js';
import TripController from './controllers/trip-controller.js';
import {generateTravelPoints} from './mock/point.js';
import {render, RenderPosition} from "./utils/render.js";

const TRAVEL_POINT_COUNT = 20;

const points = generateTravelPoints(TRAVEL_POINT_COUNT);

const siteHeaderElement = document.querySelector(`.trip-main`);
render(siteHeaderElement, new TravelInfoComponent(points).getElement(), RenderPosition.AFTERBEGIN);

const tripCostElement = siteHeaderElement.querySelector(`.trip-info`);
render(tripCostElement, new TravelCostComponent(points).getElement(), RenderPosition.BEFOREEND);

const menuElement = siteHeaderElement.querySelector(`.trip-controls h2`);
render(menuElement, new SiteMenuComponent().getElement(), RenderPosition.AFTEREND);

const filterElement = siteHeaderElement.querySelector(`.trip-controls`);
render(filterElement, new FilterComponent().getElement(), RenderPosition.BEFOREEND);

const siteMainElement = document.querySelector(`.trip-events`);
render(siteMainElement, new SortComponent().getElement(), RenderPosition.BEFOREEND);

const tripController = new TripController(siteMainElement);
tripController.render(points, siteHeaderElement);
