import AbstractView from './abstract';
import { BLANK_GENRE } from '../const';

const createPopupGenreTemplate = (film) => {
  const { genre } = film;

  const popupGenreTemplate = [];
  if (genre.length !== 0) {
    genre.forEach((element) => popupGenreTemplate.push(`<span class="film-details__genre">${element}</span>`));
  } else {popupGenreTemplate.push('<span class="film-details__genre"></span>');}

  popupGenreTemplate.join('');

  return `<section>
  <table class="film-details__table">
  <tr class="film-details__row">
  <td class="film-details__term">${genre.length !== 1 ? 'Genres' : 'Genre'}</td>
  <td class="film-details__cell">
  ${popupGenreTemplate}
  </tr>
  </table>
  </section>`;
};

export default class FilmPopupGenre extends AbstractView {
  constructor(genre = BLANK_GENRE){
    super();
    this._genre = genre;
  }

  getTemplate() {
    return createPopupGenreTemplate(this._genre);
  }
}
