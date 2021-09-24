import AbstractView from './abstract';
import {SortType} from '../const.js';

const createSortingTemplate = (currentSortType) => (
  `<ul class="sort">
    <li><a href="#" class="sort__button ${currentSortType === SortType.DEFAULT ? 'sort__button--active' : ''}" data-sort-type="${SortType.DEFAULT} sort__button--active">Sort by default</a></li>
    <li><a href="#" class="sort__button ${currentSortType === SortType.DATE_DOWN ? 'sort__button--active' : ''}" data-sort-type="${SortType.DATE_DOWN}">Sort by date</a></li>
    <li><a href="#" class="sort__button ${currentSortType === SortType.RATING_DOWN ? 'sort__button--active' : ''}" data-sort-type="${SortType.RATING_DOWN}">Sort by rating</a></li>
  </ul>`
);


export default class Sorting extends AbstractView {
  constructor(currentSortType){
    super();

    this._currentSortType = currentSortType;
    this._sortTypeChangeHandler = this._sortTypeChangeHandler.bind(this);
  }

  getTemplate() {
    return createSortingTemplate(this._sortTypeChangeHandler);
  }

  _sortTypeChangeHandler(evt) {
    if (evt.target.tagName !== 'A') {
      return;
    }

    evt.preventDefault();
    this._callback.sortTypeChange(evt.target.dataset.sortType);
  }

  setSortTypeChangeHandler(callback) {
    this._callback.sortTypeChange = callback;
    this.getElement().addEventListener('click', this._sortTypeChangeHandler);
  }
}
