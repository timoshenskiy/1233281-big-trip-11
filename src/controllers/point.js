import TravelPointComponent from "../components/travel-point.js";
import EditFormComponent from "../components/edit-form.js";
import {render, replace, RenderPosition} from "../utils/render.js";

const Mode = {
  DEFAULT: `default`,
  EDIT: `edit`,
};

export default class PointController {
  constructor(container, onDataChange, onViewChange) {
    this._container = container;
    this._onDataChange = onDataChange;
    this._onViewChange = onViewChange;
    this._mode = Mode.DEFAULT;
    this._editFormComponent = null;
    this._travelPointComponent = null;

    this._onEscKeyDown = this._onEscKeyDown.bind(this);
  }

  render(travelPoint) {
    const oldPointComponent = this._editFormComponent;
    const oldEditFormComponent = this._travelPointComponent;

    this._editFormComponent = new EditFormComponent(travelPoint);
    this._travelPointComponent = new TravelPointComponent(travelPoint);

    this._travelPointComponent.setEditButtonClickHandler(() => {
      this._onViewChange();
      this._replacePointToEdit();
      document.addEventListener(`keydown`, this._onEscKeyDown);

    });
    this._editFormComponent.setFavoritesButtonClickHandler(() => {
      this._onDataChange(this, travelPoint, Object.assign({}, travelPoint, {
        isFavorite: !travelPoint.isFavorite,
      }));
    });


    this._editFormComponent.setSubmitHandler((evt) => {
      evt.preventDefault();
      this._replaceEditToPoint();
      document.removeEventListener(`keydown`, this._onEscKeyDown);
    });

    this._editFormComponent.setEditCloseButtonClickHandler(()=>{
      this._replaceEditToPoint();
      document.removeEventListener(`keydown`, this._onEscKeyDown);
    });

    if (oldEditFormComponent && oldPointComponent) {
      replace(this._travelPointComponent, oldPointComponent);
      replace(this._editFormComponent, oldEditFormComponent);
      this._replacePointToEdit();
    } else {
      render(this._container, this._travelPointComponent.getElement(), RenderPosition.BEFOREEND);
    }
  }
  setDefaultView() {
    if (this._mode !== Mode.DEFAULT) {
      this._replaceEditToPoint();
    }
  }
  _replaceEditToPoint() {
    document.removeEventListener(`keydown`, this._onEscKeyDown);
    this._editFormComponent.reset();
    replace(this._travelPointComponent, this._editFormComponent);
    this._mode = Mode.DEFAULT;
  }
  _replacePointToEdit() {
    replace(this._editFormComponent, this._travelPointComponent);
    this._mode = Mode.EDIT;
  }

  _onEscKeyDown(evt) {
    const isEscKey = evt.key === `Escape` || evt.key === `Esc`;

    if (isEscKey) {
      this._replaceEditToPoint();
      document.removeEventListener(`keydown`, this._onEscKeyDown);
    }
  }
}
