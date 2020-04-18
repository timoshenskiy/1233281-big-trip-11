import TravelInfoComponent from '../components/travel-info.js';
import TravelCostComponent from '../components/travel-cost.js';
import SiteMenuComponent from '../components/site-menu.js';
import FilterComponent from '../components/filters.js';
import SortComponent from '../components/sorting.js';
import EditFormComponent from '../components/edit-form.js';
import PointListComponent from '../components/travel-point-list.js';
import NoPointsComponent from '../components/no-travel-points.js';
import PointComponent from '../components/travel-point.js';
import {generateTravelPoints} from '../mock/point.js';
import {render, RenderPosition} from "../utils/render.js";

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


export default class TripController {
  constructor(container) {
    this._container = container;

    this._noPointsComponent = new NoPointsComponent();

  }
  render(travelPoints, totalCostContainer, travelInfoContainer) {
    travelPoints.sort((a, b) => {
      return a.departureDate - b.departureDate;
    });

    let totalCost = 0;
    for (const travelPoint of travelPoints) {
      let offersCost = 0;
      if (travelPoint.checkedOffers.length > 0) {
        offersCost = travelPoint.checkedOffers.reduce((sum, it) =>{
          return sum + it.price;
        }, 0);
      }
      totalCost += travelPoint.price + offersCost;
    }

    render(siteHeaderElement, new TravelInfoComponent(points).getElement(), RenderPosition.AFTERBEGIN);
    render(tripCostElement, new TravelCostComponent(totalCost).getElement(), RenderPosition.BEFOREEND);

  	if (travelPoints.length === 0) {
  		render(this._container, this._noPointsComponent.getElement(), RenderPosition.BEFOREEND);
  		return;
  	}

    let currentDate = travelPoints[0].departureDate;
    let dayNumber = 1;
    let travelPointList = new PointListComponent(dayNumber, travelPoints[0].departureDate);
    render(this._container, travelPointList.getElement(), RenderPosition.BEFOREEND);
    for (const travelPoint of travelPoints) {
      if (!(currentDate.getMonth() === travelPoint.departureDate.getMonth() && currentDate.getDate() === travelPoint.departureDate.getDate())) {
        dayNumber++;
        travelPointList = new PointListComponent(dayNumber, travelPoint.departureDate);
        render(this._container, travelPointList.getElement(), RenderPosition.BEFOREEND);
      }
      currentDate = travelPoint.departureDate;
      renderPoint(travelPoint, travelPointList.getPlaceForPoint());

    }

  }
}
