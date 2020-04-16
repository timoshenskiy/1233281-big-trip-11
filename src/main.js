import TravelInfoComponent from './components/travel-info.js';
import TravelCostComponent from './components/travel-cost.js';
import SiteMenuComponent from './components/site-menu.js';
import FilterComponent from './components/filters.js';
import SortComponent from './components/sorting.js';
import EditFormComponent from './components/edit-form.js';
import PointListComponent from './components/travel-point-list.js';
import NoPointsComponent from './components/no-travel-points.js';
import PointComponent from './components/travel-point.js';
import {generateTravelPoints} from './mock/point.js';
import {render, RenderPosition} from "./utils.js";

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

const siteHeaderElement = document.querySelector(`.trip-main`);
render(siteHeaderElement, new TravelInfoComponent(points).getElement(), RenderPosition.AFTERBEGIN);

const tripCostElement = siteHeaderElement.querySelector(`.trip-info`);
render(tripCostElement, new TravelCostComponent(totalCost).getElement(), RenderPosition.BEFOREEND);

const menuElement = siteHeaderElement.querySelector(`.trip-controls h2`);
render(menuElement, new SiteMenuComponent().getElement(), RenderPosition.AFTEREND);

const filterElement = siteHeaderElement.querySelector(`.trip-controls`);
render(filterElement, new FilterComponent().getElement(), RenderPosition.BEFOREEND);

const siteMainElement = document.querySelector(`.trip-events`);
render(siteMainElement, new SortComponent().getElement(), RenderPosition.BEFOREEND);

const renderPoint = (point, pointList) => {
  const editFormComponent = new EditFormComponent(point);
  const pointComponent = new PointComponent(point);

  const editForm = editFormComponent.getElement();
  const editButton = pointComponent.getElement().querySelector(`button`);

  const replaceEditToPoint = () => {
    pointList.replaceChild(pointComponent.getElement(), editForm);
  };
  const replacePointToEdit = () => {
    pointList.replaceChild(editForm, pointComponent.getElement());
  };

  const onEscKeyDown = (evt) => {
    const isEscKey = evt.key === `Escape` || evt.key === `Esc`;

    if (isEscKey) {
      replaceEditToPoint();
      document.removeEventListener(`keydown`, onEscKeyDown);
    }
  };

  editButton.addEventListener(`click`, () => {
    replacePointToEdit();
    document.addEventListener(`keydown`, onEscKeyDown);
  });

  editForm.addEventListener(`submit`, (evt) => {
    evt.preventDefault();
    replaceEditToPoint();
    document.removeEventListener(`keydown`, onEscKeyDown);
  });

  render(pointList, pointComponent.getElement(), RenderPosition.BEFOREEND);
};

const renderPointList = (travelPoints) => {
  let currentDate = travelPoints[0].departureDate;
  let dayNumber = 1;
  let travelPointList = new PointListComponent(dayNumber, travelPoints[0].departureDate);
  render(siteMainElement, travelPointList.getElement(), RenderPosition.BEFOREEND);
  for (const travelPoint of travelPoints) {
    if (!(currentDate.getMonth() === travelPoint.departureDate.getMonth() && currentDate.getDate() === travelPoint.departureDate.getDate())) {
      dayNumber++;
      travelPointList = new PointListComponent(dayNumber, travelPoint.departureDate);
      render(siteMainElement, travelPointList.getElement(), RenderPosition.BEFOREEND);
    }
    currentDate = travelPoint.departureDate;
    renderPoint(travelPoint, travelPointList.getPlaceForPoint());

  }
};
if (points.length === 0) {
  render(siteMainElement, new NoPointsComponent().getElement(), RenderPosition.BEFOREEND);
} else {
  renderPointList(points);
}

