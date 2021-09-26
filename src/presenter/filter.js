import FilterView from '../view/site-menu.js';
import {render, RenderPosition, replace, remove} from '../utils/render.js';
import {filter} from '../utils/filter.js';
import {FilterType, UpdateType} from '../const.js';
import {filmStatisticsViewComponent, boardPresenter, siteMenuElement, handleSiteMenuClick } from '../main.js';

export default class Filter {
  constructor(filterContainer, filterModel, filmsModel) {
    this._filterContainer = filterContainer;
    this._filterModel = filterModel;
    this._filmsModel = filmsModel;

    this._filterComponent = null;

    this._handleModelEvent = this._handleModelEvent.bind(this);
    this.handleFilterTypeChange = this.handleFilterTypeChange.bind(this);

    this._filmsModel.addObserver(this._handleModelEvent);
    this._filterModel.addObserver(this._handleModelEvent);
  }

  init() {
    const filters = this._getFilters();
    const prevFilterComponent = this._filterComponent;

    this._filterComponent = new FilterView(filters, this._filterModel.getFilter());
    this._filterComponent.setFilterTypeChangeHandler(this.handleFilterTypeChange);
    // this.handleSiteMenuClick = this.handleSiteMenuClick.bind(this);
    // this._filterComponent.setMenuClickHandler(this.handleSiteMenuClick);

    if (prevFilterComponent === null) {
      render(this._filterContainer, this._filterComponent, RenderPosition.BEFOREEND);
      return;
    }

    replace(this._filterComponent, prevFilterComponent);
    remove(prevFilterComponent);
  }

  _handleModelEvent() {
    this.init();
  }

  handleFilterTypeChange(filterType) {
    if(boardPresenter._boardComponent._element === null) {
      remove(filmStatisticsViewComponent);

      this._filterModel.setFilter(UpdateType.MAJOR, filterType);
      boardPresenter.init();
      // let filmStatisticsViewComponent = null;
      siteMenuElement.addEventListener('click', handleSiteMenuClick);
    }

    if (this._filterModel.getFilter() === filterType) {
      return;
    }

    this._filterModel.setFilter(UpdateType.MAJOR, filterType);
  }

  _getFilters() {
    const films = this._filmsModel.getFilms();

    return [
      {
        type: FilterType.ALL,
        name: 'All',
        count: filter[FilterType.ALL](films).length,
      },
      {
        type: FilterType.FAVORITES,
        name: 'Favorites',
        count: filter[FilterType.FAVORITES](films).length,
      },
      {
        type: FilterType.ADDED_TO_WATCHLIST,
        name: 'AddedToWatchlist',
        count: filter[FilterType.ADDED_TO_WATCHLIST](films).length,
      },
      {
        type: FilterType.ALREADY_WATCHED,
        name: 'AlreadyWatched',
        count: filter[FilterType.ALREADY_WATCHED](films).length,
      },
    ];
  }
}
