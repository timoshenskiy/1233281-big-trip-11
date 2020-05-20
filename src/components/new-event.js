import AbstractComponent from "./abstract-component.js";

const createEmptyPointListTemplate = () => {
  return (
    `<button class="trip-main__event-add-btn  btn  btn--big  btn--yellow" type="button" }>New event</button>`
  );
};

export default class NewEvent extends AbstractComponent {
  constructor() {
    super();

    this._newEventHandler = null;
  }
  getTemplate() {
    return createEmptyPointListTemplate();
  }
  setDisabled() {
    this.getElement().disabled = true;
    this.getElement().removeEventListener(`click`, this._newEventHandler);
  }
  setEnabled() {
    this.getElement().disabled = false;
  }
  setNewEventButtonClickHandler(handler) {
    this.getElement().addEventListener(`click`, handler);
    this._newEventHandler = handler;
  }
}
