import AbstractView from './abstract';

const createSiteMenuItemTemplate = (filters) => {
  const {name, count} = filters;

  return (
    `<a href="#${name}" class="main-navigation__item"
    ${count === 0 ? 'disabled' : ''}
    >${name.toString()[0].toUpperCase()+name.toString().slice(1)} <span class="main-navigation__item-count">${count}</span></a>`
  );
};

const createSiteMenuTemplate = (filters) => {
  const filterItemsTemplate = filters.map((filter, index) => createSiteMenuItemTemplate(filter, index === 0)).slice(1).join('');

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
  constructor(filters) {
    super();
    this._filters = filters;
  }

  getTemplate() {
    return createSiteMenuTemplate(this._filters);
  }
}

