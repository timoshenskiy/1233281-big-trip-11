import API from "./api.js";
import TravelInfoComponent from "./components/travel-info.js";
import TravelCostComponent from "./components/travel-cost.js";
import SiteMenuComponent from "./components/site-menu.js";
import NewEventComponent from "./components/new-event.js";
import StatisticsComponent from "./components/statistics.js";
import FiltersController from "./controllers/filters.js";
import PointsModel from "./models/points.js";
import TripController from "./controllers/trip-controller.js";
import LoadingListComponent from "./components/loading-list.js";
import {render, RenderPosition} from "./utils/render.js";

import {SiteTabs} from "./components/site-menu.js";

const AUTHORIZATION = `Basic FKGNDFkfjghdl`;
const END_POINT = `https://11.ecmascript.pages.academy/big-trip`;

const api = new API(END_POINT, AUTHORIZATION);
const pointsModel = new PointsModel();

const siteHeaderElement = document.querySelector(`.trip-main`);
const travelInfoComponent = new TravelInfoComponent(pointsModel);
render(siteHeaderElement, travelInfoComponent.getElement(), RenderPosition.AFTERBEGIN);

const travelCostComponent = new TravelCostComponent(pointsModel);
const tripCostElement = siteHeaderElement.querySelector(`.trip-info`);
render(tripCostElement, travelCostComponent.getElement(), RenderPosition.BEFOREEND);

const menuElement = siteHeaderElement.querySelector(`.trip-controls h2`);
const siteMenuComponent = new SiteMenuComponent();
render(menuElement, siteMenuComponent.getElement(), RenderPosition.AFTEREND);

const filterElement = siteHeaderElement.querySelector(`.trip-controls`);

const filtersController = new FiltersController(filterElement, pointsModel);
filtersController.render();

const newEventComponent = new NewEventComponent();
render(siteHeaderElement, newEventComponent.getElement(), RenderPosition.BEFOREEND);

const siteMainElement = document.querySelector(`.trip-events`);

const tripController = new TripController(siteMainElement, pointsModel, newEventComponent, travelCostComponent, travelInfoComponent, filtersController, api);

const statisticsComponent = new StatisticsComponent(pointsModel);
render(siteMainElement, statisticsComponent.getElement(), RenderPosition.AFTEREND);
statisticsComponent.hide();

siteMenuComponent.setTableButtonClickHandler(()=>{
  const currentTab = siteMenuComponent.getCurrentTab();
  switch (currentTab) {
    case SiteTabs.TABLE:
      tripController.show();
      statisticsComponent.hide();
      break;
    case SiteTabs.STATS:
      tripController.hide();
      statisticsComponent.show();
      break;
  }

});

const loadingListComponent = new LoadingListComponent();

render(siteMainElement, loadingListComponent.getElement(), RenderPosition.BEFOREEND);

api.getOffers()
  .then((offers) => {
    tripController.setOffers(offers);
    api.getDestinations()
      .then((destinations) => {
        tripController.setDestinations(destinations);
        api.getPoints()
         .then((points) => {
           loadingListComponent.hide();
           pointsModel.setPoints(points);
           loadingListComponent.hide();
           tripController.render([], siteHeaderElement);
         })
         .catch(()=>{
           loadingListComponent.hide();
           tripController.render([], siteHeaderElement);
         });
      });
  });


