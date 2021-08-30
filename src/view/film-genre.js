import { createElement } from '../utils';
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

export default class FilmPopupGenre {
  constructor(genre = BLANK_GENRE){
    this._genre = genre;
    this._element=null;
  }

  getTemplate() {
    return createPopupGenreTemplate(this._genre);
  }

  getElement() {
    if(!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  removeElement(){
    this._element = null;
  }
}
