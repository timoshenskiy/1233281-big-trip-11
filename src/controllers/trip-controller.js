import EditFormComponent from '../components/edit-form.js';
import PointListComponent from '../components/travel-point-list.js';
import NoPointsComponent from '../components/no-travel-points.js';
import PointComponent from '../components/travel-point.js';
import {render, replace, RenderPosition} from "../utils/render.js";

const renderPoint = (point, pointList) => {
  const editFormComponent = new EditFormComponent(point);
  const pointComponent = new PointComponent(point);

  const replaceEditToPoint = () => {
    replace(pointComponent, editFormComponent);
  };
  const replacePointToEdit = () => {
    replace(editFormComponent, pointComponent);
  };

  const onEscKeyDown = (evt) => {
    const isEscKey = evt.key === `Escape` || evt.key === `Esc`;

    if (isEscKey) {
      replaceEditToPoint();
      document.removeEventListener(`keydown`, onEscKeyDown);
    }
  };

  pointComponent.setEditButtonClickHandler(() => {
    replacePointToEdit();
    document.addEventListener(`keydown`, onEscKeyDown);
  });

  editFormComponent.setSubmitHandler((evt) => {
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
  render(travelPoints) {
    travelPoints.sort((a, b) => {
      return a.departureDate - b.departureDate;
    });

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
