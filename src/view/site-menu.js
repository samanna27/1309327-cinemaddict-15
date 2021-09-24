import AbstractView from './abstract';

const createSiteMenuItemTemplate = (filters, currentFilterType) => {
  const {type, name, count} = filters;

  return (
    `<a href="#${name}" class="main-navigation__item"
    ${type === currentFilterType ? 'checked' : ''}
    ${count === 0 ? 'disabled' : ''}
    value="${type}"
    >${name.toString()[0].toUpperCase()+name.toString().slice(1)} <span class="main-navigation__item-count">${count}</span></a>`
  );
};

const createSiteMenuTemplate = (filters, currentFilterType) => {
  const filterItemsTemplate = filters.map((filter) => createSiteMenuItemTemplate(filter, currentFilterType)).slice(1).join('');

  return(
    `<section><nav class="main-navigation">
      <div class="main-navigation__items">
        <a href="#All" class="main-navigation__item"
        ${filters[0].count === 0 ? 'disabled' : ''}
        >All movies</a>
        ${filterItemsTemplate}
      </div>
      <a href="#stats" class="main-navigation__additional">Stats</a>
    </nav></section>`
  );
};

export default class SiteMenu extends AbstractView {
  constructor(filters, currentFilterType) {
    super();
    this._filters = filters;
    this._currentFilter = currentFilterType;

    this._filterTypeChangeHandler = this._filterTypeChangeHandler.bind(this);
  }

  getTemplate() {
    return createSiteMenuTemplate(this._filters, this._currentFilter);
  }

  _filterTypeChangeHandler(evt) {
    evt.preventDefault();
    this._callback.filterTypeChange(evt.target.value);
  }

  setFilterTypeChangeHandler(callback) {
    this._callback.filterTypeChange = callback;
    this.getElement().addEventListener('change', this._filterTypeChangeHandler);
  }
}

