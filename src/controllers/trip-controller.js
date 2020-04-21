import EditFormComponent from '../components/edit-form.js';
import TravelPointListComponent from '../components/travel-point-list.js';
import SortingComponent, {SortType} from '../components/sorting.js';
import NoTravelPointsComponent from '../components/no-travel-points.js';
import TravelPointComponent from '../components/travel-point.js';
import {render, replace, RenderPosition} from "../utils/render.js";


const getSortedTravelPoints = (sortType, travelPoints) => {
  switch (sortType) {
    case SortType.TIME:
      travelPoints.sort((a, b) => ((b.arrivalDate - b.departureDate) - (a.arrivalDate - a.departureDate)));
      break;
    case SortType.PRICE:
      travelPoints.sort((a, b) => (b.price - a.price));
      break;
  }
  return travelPoints;
};
const renderSortedTravelPoints = (container, sortedTravelPoints) => {
  const sortedTravelPointList = new TravelPointListComponent();
  render(container, sortedTravelPointList.getElement(), RenderPosition.BEFOREEND);
  for (const travelPoint of sortedTravelPoints) {
    renderPoint(travelPoint, sortedTravelPointList.getPlaceForPoint());
  }
};
const renderSorting = (container, travelPoints) => {
  const sortingComponent = new SortingComponent(SortType.EVENT);
  render(container, sortingComponent.getElement(), RenderPosition.BEFOREEND);
  sortingComponent.setSortTypeChangeHandler((sortType)=>{
    container.innerHTML = ``;
    if (sortType === SortType.EVENT) {
      render(container, sortingComponent.getElement(), RenderPosition.BEFOREEND);
      renderPoints(container, travelPoints);
      return;
    }
    const sortedTravelPoints = getSortedTravelPoints(sortType, travelPoints.slice(), container);
    render(container, sortingComponent.getElement(), RenderPosition.BEFOREEND);
    renderSortedTravelPoints(container, sortedTravelPoints);

  });
};

const renderPoint = (point, pointList) => {
  const editFormComponent = new EditFormComponent(point);
  const travelPointComponent = new TravelPointComponent(point);

  const replaceEditToPoint = () => {
    replace(travelPointComponent, editFormComponent);
  };
  const replacePointToEdit = () => {
    replace(editFormComponent, travelPointComponent);
  };

  const onEscKeyDown = (evt) => {
    const isEscKey = evt.key === `Escape` || evt.key === `Esc`;

    if (isEscKey) {
      replaceEditToPoint();
      document.removeEventListener(`keydown`, onEscKeyDown);
    }
  };

  travelPointComponent.setEditButtonClickHandler(() => {
    replacePointToEdit();
    document.addEventListener(`keydown`, onEscKeyDown);
  });

  editFormComponent.setSubmitHandler((evt) => {
    evt.preventDefault();
    replaceEditToPoint();
    document.removeEventListener(`keydown`, onEscKeyDown);
  });

  render(pointList, travelPointComponent.getElement(), RenderPosition.BEFOREEND);
};
const renderPoints = (container, travelPoints) => {
  travelPoints.sort((a, b) => {
    return a.departureDate - b.departureDate;
  });

  if (travelPoints.length === 0) {
    render(container, new NoTravelPointsComponent().getElement(), RenderPosition.BEFOREEND);
    return;
  }

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
    renderPoint(travelPoint, travelPointList.getPlaceForPoint());

  }
};

export default class TripController {
  constructor(container) {
    this._container = container;

    this._sortingComponent = new SortingComponent(SortType.EVENT);
  }
  render(travelPoints) {
    if (travelPoints.length > 0) {
      renderSorting(this._container, travelPoints);
    }
    renderPoints(this._container, travelPoints);
  }
}
