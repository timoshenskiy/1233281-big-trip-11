import TravelPointComponent from "../components/travel-point.js";
import EditFormComponent from "../components/edit-form.js";
import {render, replace, remove, RenderPosition} from "../utils/render.js";
import {POINT_TYPES_TRANSFER} from '../const.js';
import {offersForEvents} from '../mock/offers.js';

export const Mode = {
  DEFAULT: `default`,
  EDIT: `edit`,
  ADDING: `adding`,
};
export const EmptyPoint = {
  id: String(new Date() + Math.random()),
  type: POINT_TYPES_TRANSFER[0],
  destination: ``,
  departureDate: new Date(),
  arrivalDate: new Date(),
  price: ``,
  photos: [],
  description: ``,
  checkedOffers: [],
  uncheckedOffers: offersForEvents[0].list,
  isFavorite: false,
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

  render(travelPoint, mode) {
    this._mode = mode;

    const oldPointComponent = this._editFormComponent;
    const oldEditFormComponent = this._travelPointComponent;

    this._editFormComponent = new EditFormComponent(travelPoint, this._mode);
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

    this._editFormComponent.setDeleteButtonClickHandler(() => {
      this._onDataChange(this, travelPoint, null);

      document.removeEventListener(`keydown`, this._onEscKeyDown);
    });

    this._editFormComponent.setSubmitHandler((evt) => {
      evt.preventDefault();
      const newData = this._editFormComponent.getData();
      this._onDataChange(this, travelPoint, Object.assign({}, travelPoint, newData));
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
      if (this._mode === Mode.ADDING) {
        document.addEventListener(`keydown`, this._onEscKeyDown);
        this._replacePointToEdit();
      }
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
    if (document.contains(this._editFormComponent.getElement())) {
      replace(this._travelPointComponent, this._editFormComponent);
    }
    this._mode = Mode.DEFAULT;
  }
  _replacePointToEdit() {
    replace(this._editFormComponent, this._travelPointComponent);
    if (this._mode === Mode.DEFAULT) {
      this._mode = Mode.EDIT;
    }
  }

  _onEscKeyDown(evt) {
    const isEscKey = evt.key === `Escape` || evt.key === `Esc`;

    if (isEscKey) {
      if (this._mode === Mode.ADDING) {
        this._onDataChange(this, EmptyPoint, null);
      }
      this._replaceEditToPoint();
      document.removeEventListener(`keydown`, this._onEscKeyDown);
    }
  }
  destroy() {
    remove(this._editFormComponent);
    remove(this._travelPointComponent);
    document.removeEventListener(`keydown`, this._onEscKeyDown);
  }
}
