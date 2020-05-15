import TravelPointComponent from "../components/travel-point.js";
import EditFormComponent from "../components/edit-form.js";
import PointModel from "../models/point.js";
import {render, replace, remove, RenderPosition} from "../utils/render.js";
import {POINT_TYPES_TRANSFER} from "../const.js";
import {stopInteractionWithApplication} from "../utils/common.js";

export const Mode = {
  DEFAULT: `default`,
  EDIT: `edit`,
  ADDING: `adding`,
};

const SHAKE_ANIMATION_TIMEOUT = 600;

const parseFormData = (formData, form, destinations) => {
  const offers = Array.from(form.querySelectorAll(`.event__offer-selector`));
  const allCheckedOffers = offers.filter((it)=>(it.querySelector(`input`).checked)).map((it)=>{
    return ({
      title: it.querySelector(`.event__offer-title`).textContent,
      price: +it.querySelector(`.event__offer-price`).textContent,
    });
  }
  );
  const name = formData.get(`event-destination`);
  let description = ``;
  let photos = [];
  for (const destination of destinations) {
    if (destination.name === name) {
      description = destination.description;
      photos = destination.pictures;
    }
  }
  return new PointModel({
    "type": formData.get(`event-type`),
    "destination": {
      "description": description,
      "name": formData.get(`event-destination`),
      "pictures": photos,
    },
    "date_from": new Date(formData.get(`event-start-time`)),
    "date_to": new Date(formData.get(`event-end-time`)),
    "base_price": +formData.get(`event-price`),
    "offers": allCheckedOffers,
  });
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
  isFavorite: false,
};

export default class PointController {
  constructor(container, onDataChange, onViewChange, offers, destinations) {
    this._container = container;
    this._onDataChange = onDataChange;
    this._onViewChange = onViewChange;
    this._offers = offers;
    this._destinations = destinations;
    this._mode = Mode.DEFAULT;
    this._editFormComponent = null;
    this._travelPointComponent = null;

    this._onEscKeyDown = this._onEscKeyDown.bind(this);
  }

  render(travelPoint, mode) {
    this._mode = mode;

    const oldPointComponent = this._editFormComponent;
    const oldEditFormComponent = this._travelPointComponent;

    this._editFormComponent = new EditFormComponent(travelPoint, this._mode, this._offers, this._destinations);
    this._travelPointComponent = new TravelPointComponent(travelPoint);

    this._travelPointComponent.setEditButtonClickHandler(() => {
      this._onViewChange();
      this._replacePointToEdit();
      document.addEventListener(`keydown`, this._onEscKeyDown);
    });

    this._editFormComponent.setFavoritesButtonClickHandler(() => {
      const newTravelPoint = PointModel.clone(travelPoint);
      newTravelPoint.isFavorite = !newTravelPoint.isFavorite;
      this._onDataChange(this, travelPoint, newTravelPoint);
    });

    this._editFormComponent.setDeleteButtonClickHandler((evt) => {
      evt.preventDefault();
      this._editFormComponent.showNotificationAboutDeleting();

      if (this._editFormComponent.checkForErrors()) {
        this._editFormComponent.removeErrorStyle();
      }

      const onError = () => {
        this._editFormComponent.removeNotificationAboutDeleting();
        this._editFormComponent.addErrorStyle();
      };
      this._onDataChange(this, travelPoint, null, onError);

      document.removeEventListener(`keydown`, this._onEscKeyDown);
    });

    this._editFormComponent.setSubmitHandler((evt) => {
      evt.preventDefault();
      const receivedData = this._editFormComponent.getData();
      const formData = receivedData.formData;
      const data = parseFormData(formData, this._editFormComponent.getElement(), this._destinations);
      data.id = receivedData.id;
      data.isFavorite = receivedData.isFavorite;
      this._editFormComponent.showNotificationAboutSaving();
      stopInteractionWithApplication();

      if (this._editFormComponent.checkForErrors()) {
        this._editFormComponent.removeErrorStyle();
      }
      const onError = () => {
        this._editFormComponent.removeNotificationAboutSaving();
        this._editFormComponent.addErrorStyle();
      };
      this._onDataChange(this, travelPoint, data, onError);

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
  shake() {
    this._editFormComponent.getElement().style.animation = `shake ${SHAKE_ANIMATION_TIMEOUT / 1000}s`;
    this._travelPointComponent.getElement().style.animation = `shake ${SHAKE_ANIMATION_TIMEOUT / 1000}s`;

    setTimeout(() => {
      this._editFormComponent.getElement().style.animation = ``;
      this._travelPointComponent.getElement().style.animation = ``;
    }, SHAKE_ANIMATION_TIMEOUT);
  }
}
