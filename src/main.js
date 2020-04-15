import TravelInfoComponent from './components/travel-info.js';
import TravelCostComponent from './components/travel-cost.js';
import SiteMenuComponent from './components/site-menu.js';
import FilterComponent from './components/filters.js';
import SortComponent from './components/sorting.js';
import EditFormComponent from './components/edit-form.js';
import PointListComponent from './components/travel-point-list.js';
import PointComponent from './components/travel-point.js';
import {generateTravelPoints} from './mock/point.js';
import {render, RenderPosition} from "./utils.js";

const TRAVEL_POINT_COUNT = 3;

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

const renderPoint = (point) => {

  const pointList = siteMainElement.querySelector(`.trip-days:last-child .trip-events__list`);

  const editFormComponent = new EditFormComponent(point);
  const pointComponent = new PointComponent(point);

  const editForm = editFormComponent.getElement();
  const editButton = pointComponent.getElement().querySelector(`button`);

  editButton.addEventListener(`click`, () => {
    pointList.replaceChild(editForm, pointComponent.getElement());
  });
  editForm.addEventListener(`submit`, () => {
    pointList.replaceChild(pointComponent.getElement(), editForm);
  });

  render(pointList, pointComponent.getElement(), RenderPosition.BEFOREEND);
};

const renderPointList = (travelPoints) => {
  let currentDate = travelPoints[0].departureDate;
  let dayNumber = 1;
  render(siteMainElement, new PointListComponent(dayNumber, travelPoints[0].departureDate).getElement(), RenderPosition.BEFOREEND);
  for (const travelPoint of travelPoints) {
    if (!(currentDate.getMonth() === travelPoint.departureDate.getMonth() && currentDate.getDate() === travelPoint.departureDate.getDate())) {
      dayNumber++;
      render(siteMainElement, new PointListComponent(dayNumber, travelPoint.departureDate).getElement(), RenderPosition.BEFOREEND);
    }
    currentDate = travelPoint.departureDate;
    renderPoint(travelPoint);

  }
};
renderPointList(points);
