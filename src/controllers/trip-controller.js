import PointController from './point.js';
import SortingComponent, {SortType} from '../components/sorting.js';
import NoTravelPointsComponent from '../components/no-travel-points.js';
import TravelPointListComponent from '../components/travel-point-list.js';
import {render, RenderPosition} from "../utils/render.js";


export const sortTravelPoints = (sortType, travelPoints) => {
  switch (sortType) {
    case SortType.TIME:
      travelPoints.sort((a, b) => ((b.arrivalDate - b.departureDate) - (a.arrivalDate - a.departureDate)));
      break;
    case SortType.PRICE:
      travelPoints.sort((a, b) => (b.price - a.price));
      break;
    case SortType.EVENT:
      travelPoints.sort((a, b) => (a.departureDate - b.departureDate));
      break;
  }
};
const renderSortedTravelPoints = (container, sortedTravelPoints, onDataChange, onViewChange) => {
  const sortedTravelPointList = new TravelPointListComponent();
  render(container, sortedTravelPointList.getElement(), RenderPosition.BEFOREEND);
  for (const travelPoint of sortedTravelPoints) {
    const pointController = new PointController(sortedTravelPointList.getPlaceForPoint(), onDataChange, onViewChange);
    pointController.render(travelPoint);
  }
};
const renderSorting = (container, travelPoints, onDataChange, onViewChange) => {
  const sortingComponent = new SortingComponent(SortType.EVENT);
  render(container, sortingComponent.getElement(), RenderPosition.BEFOREEND);
  sortingComponent.setSortTypeChangeHandler((sortType)=>{
    container.innerHTML = ``;
    if (sortType === SortType.EVENT) {
      render(container, sortingComponent.getElement(), RenderPosition.BEFOREEND);
      renderPoints(container, travelPoints, onDataChange);
      return;
    }
    const sortedTravelPoints = travelPoints.slice();
    sortTravelPoints(sortType, sortedTravelPoints);
    render(container, sortingComponent.getElement(), RenderPosition.BEFOREEND);
    renderSortedTravelPoints(container, sortedTravelPoints, onDataChange, onViewChange);

  });
};


const renderPoints = (container, travelPoints, onDataChange, onViewChange) => {
  const pointControllers = [];
  sortTravelPoints(SortType.EVENT, travelPoints);

  let currentDate = travelPoints[0].departureDate;
  let dayNumber = 1;
  let travelPointList = new TravelPointListComponent(dayNumber, travelPoints[0].departureDate);
  render(container, travelPointList.getElement(), RenderPosition.BEFOREEND);
  for (const travelPoint of travelPoints) {
    if (!(currentDate.getMonth() === travelPoint.departureDate.getMonth() && currentDate.getDate() === travelPoint.departureDate.getDate())) {
      dayNumber++;
      travelPointList = new TravelPointListComponent(dayNumber, travelPoint.departureDate);
      render(container, travelPointList.getElement(), RenderPosition.BEFOREEND);
    }
    currentDate = travelPoint.departureDate;

    const pointController = new PointController(travelPointList.getPlaceForPoint(), onDataChange, onViewChange);
    pointControllers.push(pointController);
    pointController.render(travelPoint);
  }
  return pointControllers;
};

export default class TripController {
  constructor(container) {
    this._container = container;

    this._travelPoints = [];
    this._pointControllers = [];

    this._onDataChange = this._onDataChange.bind(this);
    this._onViewChange = this._onViewChange.bind(this);
    this._noTravelPointsComponent = new NoTravelPointsComponent();
    this._sortingComponent = new SortingComponent(SortType.EVENT);
  }
  render(travelPoints) {
    this._travelPoints = travelPoints;
    if (this._travelPoints.length > 0) {
      renderSorting(this._container, this._travelPoints, this._onDataChange, this._onViewChange);
    } else {
      render(this._container, this._noTravelPointsComponent.getElement(), RenderPosition.BEFOREEND);
      return;
    }

    this._pointControllers = renderPoints(this._container, this._travelPoints, this._onDataChange, this._onViewChange);
  }
  _onViewChange() {
    this._pointControllers.forEach((it) => it.setDefaultView());
  }
  _onDataChange(pointController, oldData, newData) {
    const index = this._travelPoints.findIndex((it) => it === oldData);

    if (index === -1) {
      return;
    }
    this._travelPoints = [].concat(this._travelPoints.slice(0, index), newData, this._travelPoints.slice(index + 1));

    pointController.render(this._travelPoints[index]);

  }
}
