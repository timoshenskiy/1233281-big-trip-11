import AbstractComponent from './abstract-component.js';

const createEmptyPointListTemplate = () => {
  return (
    `<section class="trip-events">
          <h2 class="visually-hidden">Trip events</h2>

          <p class="trip-events__msg">Click New Event to create your first point</p>
        </section>`
  );
};

export default class NoPoints extends AbstractComponent {
  getTemplate() {
    return createEmptyPointListTemplate();
  }
}
