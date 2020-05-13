import AbstractComponent from './abstract-component.js';

const createLoadingListTemplate = () => {
  return (
    `<p class="trip-events__msg">Loading...</p>`
  );
};

export default class LoadingList extends AbstractComponent {
  getTemplate() {
    return createLoadingListTemplate();
  }
  setNewEventButtonClickHandler(handler) {
    this.getElement().addEventListener(`click`, handler);
  }

}
