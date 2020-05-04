import AbstractComponent from './abstract-component.js';

const createEmptyPointListTemplate = () => {
  return (
    `<button class="trip-main__event-add-btn  btn  btn--big  btn--yellow" type="button" }>New event</button>`
  );
};

export default class NewEvent extends AbstractComponent {
  getTemplate() {
    return createEmptyPointListTemplate(this._mode);
  }
  setNewEventButtonClickHandler(handler) {
    this.getElement().addEventListener(`click`, handler);
  }
  setDisabled() {
    this.getElement().disabled = true;
  }
  setEnabled() {
    this.getElement().disabled = false;
  }
}
