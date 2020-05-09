import AbstractComponent from './abstract-component.js';

export const SiteTabs = {
  TABLE: `Table`,
  STATS: `Stats`,
};

const createSiteMenuTemplate = () => {
  return (
    `<div class="trip-main__trip-controls  trip-controls">
            <h2 class="visually-hidden">Switch trip view</h2>
            <nav class="trip-controls__trip-tabs  trip-tabs">
              <a class="trip-tabs__btn  trip-tabs__btn--active" href="#">Table</a>
              <a class="trip-tabs__btn" href="#">Stats</a>
            </nav>
          </div>`
  );
};

export default class SiteMenu extends AbstractComponent {
  constructor() {
    super();

    this._currentTab = SiteTabs.TABLE;
  }
  getTemplate() {
    return createSiteMenuTemplate();
  }
  setTableButtonClickHandler(handler) {
    this.getElement().querySelector(`.trip-controls__trip-tabs`).addEventListener(`click`, (evt)=>{
      if (evt.target.classList.contains(`trip-tabs__btn--active`)) {
        return;
      }
      this.getElement().querySelector(`.trip-tabs__btn--active`).classList.remove(`trip-tabs__btn--active`);
      evt.target.classList.add(`trip-tabs__btn--active`);
      this._toggleCurrentTab();

      handler();
    });
  }
  _toggleCurrentTab() {
    if (this._currentTab === SiteTabs.TABLE) {
      this._currentTab = SiteTabs.STATS;
    } else {
      this._currentTab = SiteTabs.TABLE;
    }
  }
  getCurrentTab() {
    return this._currentTab;
  }

}
