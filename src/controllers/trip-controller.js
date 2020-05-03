import PointController, {EmptyPoint, Mode as PointControllerMode} from './point.js';
import SortingComponent, {SortType} from '../components/sorting.js';
import NoTravelPointsComponent from '../components/no-travel-points.js';
import TravelPointListComponent from '../components/travel-point-list.js';
import {render, RenderPosition} from "../utils/render.js";
import {FilterType} from '../const.js';


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
const renderSorting = (container, pointsModel, sortingComponent, onDataChange, onViewChange) => {
  render(container, sortingComponent.getElement(), RenderPosition.BEFOREEND);
  sortingComponent.setSortTypeChangeHandler((sortType)=>{
    container.innerHTML = ``;
    if (sortType === SortType.EVENT) {
      render(container, sortingComponent.getElement(), RenderPosition.BEFOREEND);
      renderPoints(container, pointsModel.getPoints(), onDataChange);
      return;
    }
    const sortedTravelPoints = pointsModel.getPoints().slice();
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
  constructor(container, pointsModel, newEventComponent, travelCostComponent, travelInfoComponent, filtersController) {
    this._container = container;
    this._pointsModel = pointsModel;

    this._travelPoints = [];
    this._pointControllers = [];

    this._creatingPoint = null;
    this._onDataChange = this._onDataChange.bind(this);
    this._onViewChange = this._onViewChange.bind(this);
    this._onFilterChange = this._onFilterChange.bind(this);
    this._onTravelCostChange = this._onTravelCostChange.bind(this);
    this._onTravelInfoChange = this._onTravelInfoChange.bind(this);

    this._noTravelPointsComponent = new NoTravelPointsComponent();
  
    this._sortingComponent = new SortingComponent(SortType.EVENT);
    this._newEventComponent = newEventComponent;
    this._travelCostComponent = travelCostComponent;
    this._travelInfoComponent = travelInfoComponent;

    this._filtersController = filtersController;

    this._pointsModel.setFilterChangeHandler(this._onFilterChange);

    // Подписываю на изменения информации для сортировки и стоимости пути
    this._pointsModel.setDataChangeHandler(this._onTravelInfoChange);
    this._pointsModel.setDataChangeHandler(this._onTravelCostChange);
  }
  _onTravelCostChange() {
    this._travelCostComponent.updatePoints(this._pointsModel.getAllPoints());
  }
  _onTravelInfoChange() {
    this._travelInfoComponent.updatePoints(this._pointsModel.getAllPoints());
  }
  render() {
    this._travelPoints = this._pointsModel.getPoints();
    if (this._travelPoints.length > 0) {
      this._pointControllers = renderSorting(this._container, this._pointsModel, this._sortingComponent, this._onDataChange, this._onViewChange);
    } else {
      render(this._container, this._noTravelPointsComponent.getElement(), RenderPosition.BEFOREEND);
      return;
    }
    this.renderPoints();
    this._addEventButton();
  }
  renderPoints() {
    this._pointControllers = renderPoints(this._container, this._travelPoints, this._onDataChange, this._onViewChange);
  }
  _onViewChange() {
    if (this._creatingPoint) {
      this._creatingPoint.destroy();
      this._creatingPoint = null;
      this._newEventComponent.setEnabled();
    }
    this._pointControllers.forEach((it) => it.setDefaultView());
  }
  _onDataChange(pointController, oldData, newData) {
    // 1) Если старые данные это пустая точка, значит это добавление новой точки
    if (oldData === EmptyPoint) {
      this._newEventComponent.setEnabled();
      this._creatingPoint = null;
      if (newData === null) {
        pointController.destroy();
      } else {
        this._pointsModel.addPoint(newData);
        pointController.render(newData, PointControllerMode.DEFAULT);
        this._pointControllers = [].concat(pointController, this._pointControllers);

      }
      this._updatePoints();
    // Если не поступило новых данных, значит это удаление.
    } else if (newData === null) {
      this._pointsModel.removePoint(oldData.id);
      this._updatePoints();
    // Редактирование
    } else {
      const isSuccess = this._pointsModel.updatePoint(oldData.id, newData);

      if (isSuccess) {
        pointController.render(newData, PointControllerMode.DEFAULT);
      }
    }
  }
  _onFilterChange() {
    this._updatePoints();
  }
  _removePoints() {
    this._pointControllers.forEach((pointController) => pointController.destroy());
    this._pointControllers = [];
  }
  _updatePoints() {
    this._removePoints();
    this._container.innerHTML = ``;
    this.render();
  }
  _createPoint() {
    if (this._creatingPoint) {
      return;
    }
    const travelPointList = new TravelPointListComponent();
    const travelPointListElement = travelPointList.getElement();

    render(this._sortingComponent.getElement(), travelPointListElement, RenderPosition.AFTEREND);
    this._creatingPoint = new PointController(travelPointList.getPlaceForPoint(), this._onDataChange, this._onViewChange);
    this._creatingPoint.render(EmptyPoint, PointControllerMode.ADDING);
  }

  _addEventButton() {
    this._newEventComponent.setNewEventButtonClickHandler(()=>{
      this._sortingComponent.setDefault();
      this._filtersController.render();
      this._pointsModel.setFilter(FilterType.EVERYTHING);
      this._onViewChange();
      this._createPoint();
      this._newEventComponent.setDisabled();
    });
  }
}
