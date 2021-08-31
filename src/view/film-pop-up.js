import AbstractView from './abstract.js';
import { BLANK_FILM } from '../const';

const createFilmPopupTemplate = (film) => {
  const {title, originalTitle, poster, fullDescription, rating, director, writers, actors, releaseDate, duration, country, isAddedToWatchlist, isAlreadyWatched, isFavorite } = film;

  const addedToWatchlistClassName = isAddedToWatchlist
    ? 'film-details__control-button--active '
    : '';

  const alreadyWatchedClassName = isAlreadyWatched
    ? 'film-details__control-button--active '
    : '';

  const favoriteClassName = isFavorite
    ? 'film-details__control-button--active '
    : '';

  return `<section class="film-details">
  <form class="film-details__inner" action="" method="get">
    <div class="film-details__top-container">
      <div class="film-details__close">
        <button class="film-details__close-btn" type="button">close</button>
      </div>
      <div class="film-details__info-wrap">
        <div class="film-details__poster">
          <img class="film-details__poster-img" src="${poster}" alt="">

          <p class="film-details__age">18+</p>
        </div>

        <div class="film-details__info">
          <div class="film-details__info-head">
            <div class="film-details__title-wrap">
              <h3 class="film-details__title">${title}</h3>
              <p class="film-details__title-original">Original: ${originalTitle}</p>
            </div>

            <div class="film-details__rating">
              <p class="film-details__total-rating">${rating}</p>
            </div>
          </div>

          <table class="film-details__table">
            <tr class="film-details__row">
              <td class="film-details__term">Director</td>
              <td class="film-details__cell">${director}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Writers</td>
              <td class="film-details__cell">${writers}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Actors</td>
              <td class="film-details__cell">${actors}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Release Date</td>
              <td class="film-details__cell">${releaseDate}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Runtime</td>
              <td class="film-details__cell">${duration}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Country</td>
              <td class="film-details__cell">${country}</td>
            </tr>
          </table>

          <p class="film-details__film-description">
            ${fullDescription}
          </p>
        </div>
      </div>

      <section class="film-details__controls">
        <button type="button" class="film-details__control-button ${addedToWatchlistClassName} film-details__control-button--watchlist" id="watchlist" name="watchlist">Add to watchlist</button>
        <button type="button" class="film-details__control-button ${alreadyWatchedClassName} film-details__control-button--watched" id="watched" name="watched">Already watched</button>
        <button type="button" class="film-details__control-button ${favoriteClassName} film-details__control-button--favorite" id="favorite" name="favorite">Add to favorites</button>
      </section>
    </div>

    <div class="film-details__bottom-container">
    </div>
  </form>
</section>`;
};

export default class FilmPopup extends AbstractView{
  constructor(film = BLANK_FILM){
    super();
    this._film = film;

    this._popupClsButtonClickHandler = this._popupClsButtonClickHandler.bind(this);
  }

  getTemplate() {
    return createFilmPopupTemplate(this._film);
  }

  _popupClsButtonClickHandler(evt) {
    evt.preventDefault();
    this._callback.popupClsButtonClick();
  }

  setPopupClsButtonClickHandler(callback) {
    this._callback.popupClsButtonClick = callback;
    this.getElement().querySelector('.film-details__close-btn').addEventListener('click', this._popupClsButtonClickHandler);
  }
}
