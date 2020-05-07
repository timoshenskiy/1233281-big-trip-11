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
      this._renderSorting();
    } else {
      render(this._container, this._noTravelPointsComponent.getElement(), RenderPosition.BEFOREEND);
      return;
    }
    this.renderPoints();
    this._newEventComponent.setNewEventButtonClickHandler(()=>{
      this._sortingComponent.setDefault();
      this._filtersController.render();
      this._pointsModel.setFilter(FilterType.EVERYTHING);
      this._onViewChange();
      this._createPoint();
      this._newEventComponent.setDisabled();
    });
  }
  renderPoints() {
    const pointControllers = [];
    sortTravelPoints(SortType.EVENT, this._pointsModel.getPoints());
    let currentDate = this._pointsModel.getPoints()[0].departureDate;
    let dayNumber = 1;
    let travelPointList = new TravelPointListComponent(dayNumber, this._pointsModel.getPoints()[0].departureDate);
    render(this._container, travelPointList.getElement(), RenderPosition.BEFOREEND);
    for (const travelPoint of this._pointsModel.getPoints()) {
      if (!(currentDate.getMonth() === travelPoint.departureDate.getMonth() && currentDate.getDate() === travelPoint.departureDate.getDate())) {
        dayNumber++;
        travelPointList = new TravelPointListComponent(dayNumber, travelPoint.departureDate);
        render(this._container, travelPointList.getElement(), RenderPosition.BEFOREEND);
      }
      currentDate = travelPoint.departureDate;

      const pointController = new PointController(travelPointList.getPlaceForPoint(), this._onDataChange, this._onViewChange);
      pointControllers.push(pointController);
      pointController.render(travelPoint);
    }
    return pointControllers;
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
      // Отмена создания точки
      if (newData === null) {
        pointController.destroy();
        this._newEventComponent.setEnabled();
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
    this._newEventComponent.setEnabled();
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
    if (this._pointsModel.getAllPoints().length === 0) {
      const travelPointList = new TravelPointListComponent();
      const travelPointListElement = travelPointList.getElement();

      render(this._container, travelPointListElement, RenderPosition.AFTERBEGIN);
      this._creatingPoint = new PointController(travelPointList.getPlaceForPoint(), this._onDataChange, this._onViewChange);
      this._creatingPoint.render(EmptyPoint, PointControllerMode.ADDING);

    } else {
      const travelPointList = new TravelPointListComponent();
      const travelPointListElement = travelPointList.getElement();

      render(this._sortingComponent.getElement(), travelPointListElement, RenderPosition.AFTEREND);
      this._creatingPoint = new PointController(travelPointList.getPlaceForPoint(), this._onDataChange, this._onViewChange);
      this._creatingPoint.render(EmptyPoint, PointControllerMode.ADDING);
    }
  }

  _renderSorting() {
    render(this._container, this._sortingComponent.getElement(), RenderPosition.BEFOREEND);
    this._sortingComponent.setSortTypeChangeHandler((sortType)=>{
      this._container.innerHTML = ``;
      if (sortType === SortType.EVENT) {
        render(this._container, this._sortingComponent.getElement(), RenderPosition.BEFOREEND);
        this.renderPoints(this._container, this._pointsModel.getPoints(), this._onDataChange);
        return;
      }
      const sortedTravelPoints = this._pointsModel.getPoints().slice();
      sortTravelPoints(sortType, sortedTravelPoints);
      render(this._container, this._sortingComponent.getElement(), RenderPosition.BEFOREEND);
      this._renderSortedTravelPoints(sortedTravelPoints);
    });
  }
  _renderSortedTravelPoints(sortedTravelPoints) {
    this._removePoints();
    const sortedTravelPointList = new TravelPointListComponent();
    render(this._container, sortedTravelPointList.getElement(), RenderPosition.BEFOREEND);
    for (const travelPoint of sortedTravelPoints) {
      const pointController = new PointController(sortedTravelPointList.getPlaceForPoint(), this._onDataChange, this._onViewChange);
      pointController.render(travelPoint);
      this._pointControllers.push(pointController);

    }

  }
  hide() {
    this._container.classList.add(`visually-hidden`);
  }

  show() {
    this._container.classList.remove(`visually-hidden`);
  }
}
