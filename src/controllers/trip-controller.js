import EditFormComponent from '../components/edit-form.js';
import TravelPointListComponent from '../components/travel-point-list.js';
import NoTravelPointsComponent from '../components/no-travel-points.js';
import TravelPointComponent from '../components/travel-point.js';
import {render, replace, RenderPosition} from "../utils/render.js";

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


export default class TripController {
  constructor(container) {
    this._container = container;

    this._noTravelPointsComponent = new NoTravelPointsComponent();
  }
  render(travelPoints) {
    travelPoints.sort((a, b) => {
      return a.departureDate - b.departureDate;
    });

    if (travelPoints.length === 0) {
      render(this._container, this._noTravelPointsComponent.getElement(), RenderPosition.BEFOREEND);
      return;
    }

    let currentDate = travelPoints[0].departureDate;
    let dayNumber = 1;
    let travelPointList = new TravelPointListComponent(dayNumber, travelPoints[0].departureDate);
    render(this._container, travelPointList.getElement(), RenderPosition.BEFOREEND);
    for (const travelPoint of travelPoints) {
      if (!(currentDate.getMonth() === travelPoint.departureDate.getMonth() && currentDate.getDate() === travelPoint.departureDate.getDate())) {
        dayNumber++;
        travelPointList = new TravelPointListComponent(dayNumber, travelPoint.departureDate);
        render(this._container, travelPointList.getElement(), RenderPosition.BEFOREEND);
      }
      currentDate = travelPoint.departureDate;
      renderPoint(travelPoint, travelPointList.getPlaceForPoint());

    }

  }
}
