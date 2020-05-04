import TravelInfoComponent from './components/travel-info.js';
import TravelCostComponent from './components/travel-cost.js';
import SiteMenuComponent from './components/site-menu.js';
import NewEventComponent from './components/new-event.js';
import FiltersController from "./controllers/filters.js";
import PointsModel from "./models/points.js";
import TripController from './controllers/trip-controller.js';
import {generateTravelPoints} from './mock/point.js';
import {render, RenderPosition} from "./utils/render.js";

const TRAVEL_POINT_COUNT = 1;

const points = generateTravelPoints(TRAVEL_POINT_COUNT);
const pointsModel = new PointsModel();
pointsModel.setPoints(points);

const siteHeaderElement = document.querySelector(`.trip-main`);
const travelInfoComponent = new TravelInfoComponent(points);
render(siteHeaderElement, travelInfoComponent.getElement(), RenderPosition.AFTERBEGIN);

const travelCostComponent = new TravelCostComponent(points);
const tripCostElement = siteHeaderElement.querySelector(`.trip-info`);
render(tripCostElement, travelCostComponent.getElement(), RenderPosition.BEFOREEND);

const menuElement = siteHeaderElement.querySelector(`.trip-controls h2`);
render(menuElement, new SiteMenuComponent().getElement(), RenderPosition.AFTEREND);

const filterElement = siteHeaderElement.querySelector(`.trip-controls`);

const filtersController = new FiltersController(filterElement, pointsModel);
filtersController.render();

const newEventComponent = new NewEventComponent();
render(siteHeaderElement, newEventComponent.getElement(), RenderPosition.BEFOREEND);

const siteMainElement = document.querySelector(`.trip-events`);

const tripController = new TripController(siteMainElement, pointsModel, newEventComponent, travelCostComponent, travelInfoComponent, filtersController);
tripController.render(points, siteHeaderElement);

