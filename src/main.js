import TravelInfoComponent from './components/travel-info.js';
import TravelCostComponent from './components/travel-cost.js';
import SiteMenuComponent from './components/site-menu.js';
import FiltersController from "./controllers/filters.js";
import PointsModel from "./models/points.js";
import TripController from './controllers/trip-controller.js';
import {generateTravelPoints} from './mock/point.js';
import {render, RenderPosition} from "./utils/render.js";

const TRAVEL_POINT_COUNT = 20;

const points = generateTravelPoints(TRAVEL_POINT_COUNT);
const pointsModel = new PointsModel();
pointsModel.setPoints(points);

const siteHeaderElement = document.querySelector(`.trip-main`);
render(siteHeaderElement, new TravelInfoComponent(points).getElement(), RenderPosition.AFTERBEGIN);

const tripCostElement = siteHeaderElement.querySelector(`.trip-info`);
render(tripCostElement, new TravelCostComponent(points).getElement(), RenderPosition.BEFOREEND);

const menuElement = siteHeaderElement.querySelector(`.trip-controls h2`);
render(menuElement, new SiteMenuComponent().getElement(), RenderPosition.AFTEREND);

const filterElement = siteHeaderElement.querySelector(`.trip-controls`);
// инстанс фильтра
const filtersController = new FiltersController(filterElement, pointsModel);
filtersController.render();

const siteMainElement = document.querySelector(`.trip-events`);

const tripController = new TripController(siteMainElement, pointsModel);
tripController.render(points, siteHeaderElement);
