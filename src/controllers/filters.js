import FiltersComponent from "../components/filters.js";
import {FilterType} from "../const.js";
import {render, replace, RenderPosition} from "../utils/render.js";

export default class FiltersController {
  constructor(container, pointsModel) {
    this._container = container;
    this._pointsModel = pointsModel;

    this._activeFilterType = FilterType.EVERYTHING;
    this._filtersComponent = null;

    this._onDataChange = this._onDataChange.bind(this);
    this._onFilterChange = this._onFilterChange.bind(this);

    this._pointsModel.setDataChangeHandler(this._onDataChange);
  }

  render() {
    const container = this._container;
    const filters = Object.values(FilterType).map((filterType) => {
      return {
        name: filterType,
        checked: filterType === this._activeFilterType,
      };
    });
    const oldComponent = this._filtersComponent;

    this._filtersComponent = new FiltersComponent(filters);
    this._filtersComponent.setFilterChangeHandler(this._onFilterChange);

    if (oldComponent) {
      replace(this._filtersComponent, oldComponent);
    } else {
      render(container, this._filtersComponent.getElement(), RenderPosition.BEFOREEND);
    }
  }

  _onFilterChange(filterType) {
    this._pointsModel.setFilter(filterType);
    this._activeFilterType = filterType;
  }

  _onDataChange() {
    this.render();
  }
}
