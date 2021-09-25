import AbstractView from './abstract';

const createSiteMenuItemTemplate = (filter, currentFilterType) => {
  const {type, name, count} = filter;

  return (
    `<a href="#${name}" class="main-navigation__item ${type === currentFilterType ? 'main-navigation__item--active' : ''}"
    ${count === 0 ? 'disabled' : ''}
    id="${type}"
    >${name.toString()[0].toUpperCase()+name.toString().slice(1)} <span class="main-navigation__item-count">${count}</span></a>`
  );
};

const createSiteMenuTemplate = (filters, currentFilterType) => {
  const {type, count} = filters[0];
  const filterItemsTemplate = filters.map((filter) => createSiteMenuItemTemplate(filter, currentFilterType)).slice(1).join('');

  return(
    `<section><nav class="main-navigation">
      <div class="main-navigation__items">
        <a href="#All" class="main-navigation__item ${type === currentFilterType ? 'main-navigation__item--active' : ''}"
        ${count === 0 ? 'disabled' : ''}
        id="${type}"
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
    this._callback.filterTypeChange(evt.target.id);
  }

  setFilterTypeChangeHandler(callback) {
    this._callback.filterTypeChange = callback;
    this.getElement().querySelectorAll('.main-navigation__item').forEach((filterLinkElement) => filterLinkElement.addEventListener('click', this._filterTypeChangeHandler));
  }
}

