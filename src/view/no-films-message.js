import AbstractView from './abstract';
import {FilterType} from '../const.js';

const NoFilmsTextType = {
  [FilterType.ALL]: 'There are no movies in our database',
  [FilterType.FAVORITES]: 'There are no favorite movies now',
  [FilterType.ADDED_TO_WATCHLIST]: 'There are no movies to watch now',
  [FilterType.ALREADY_WATCHED]: 'There are no watched movies now',
};

const createNoFilmsTemplate = (filterType) => {
  const noFilmTextValue = NoFilmsTextType[filterType];

  return (
    `<section class="films">
  <section class="films-list">
    <h2 class="films-list__title">${noFilmTextValue}</h2>
      </section>
      </section>`);
};

export default class NoFilm extends AbstractView {
  constructor(data) {
    super();
    this._data = data;
  }

  getTemplate() {
    return  createNoFilmsTemplate(this._data);
  }
}

