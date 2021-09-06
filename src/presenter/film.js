import FilmView from '../view/film-card';
import FilmPopupView from '../view/film-pop-up';
import CommentInPopupView from '../view/comments-in-popup';
import FilmPopupGenreView from '../view/film-genre';
import {render, RenderPosition, replace, remove} from '../utils/render.js';
import { isEscEvent } from '../utils/common.js';

export default class Film {
  constructor(film, place){
    this._filmsListComponent = place;

    this._filmComponent = null;
    this._filmPopupComponent = null;
    this._filmPopupGenreComponent = new FilmPopupGenreView(film);
    this._commentInPopupComponent = new CommentInPopupView(film);

    this._handleFilmCardClick = this._handleFilmCardClick.bind(this);
    this._handlePopupClsButtonClick = this._handlePopupClsButtonClick(this);
    this._escKeyDownHandler = this._escKeyDownHandler.bind(this);
  }

  init(film) {
    this._film = film;

    const prevFilmComponent = this._FilmComponent;
    const prevFilmPopupComponent = this._filmPopupComponent;

    this._filmComponent = new FilmView(film);
    this._filmPopupComponent = new FilmPopupView(film);

    render(this._filmsListComponent, this._filmComponent, RenderPosition.BEFOREEND);

    this._filmComponent.setFilmCardClickHandler(this._handleFilmCardClick);
    this._filmPopupComponent.setPopupClsButtonClickHandler(this._handlePopupClsButtonClick);
  }

  _replaceFilmCardToPopup() {
    replace(this._filmPopupComponent, this._filmComponent);

    const genreInPopupContainterElement = document.querySelector('.film-details__table');
    render(genreInPopupContainterElement, this._filmPopupGenreComponent, RenderPosition.BEFOREEND);

    const commentsInPopupContainterElement = document.querySelector('.film-details__bottom-container');
    render(commentsInPopupContainterElement, this._commentInPopupComponent, RenderPosition.BEFOREEND);

    document.querySelector('body').classList.add('hide-overflow');
    document.addEventListener('keydown', this._EscKeydownHandler);
  }

  _replacePopupToFilmCard() {
    replace(this._filmComponent, this._filmPopupComponent);
    document.querySelector('body').classList.remove('hide-overflow');
    document.removeEventListener('keydown', this._escKeyDownHandler);
    remove(this._filmPopupGenreComponent);
  }

  _handleFilmCardClick() {
    this._replaceFilmCardToPopup();
  }

  _escKeyDownHandler(evt) {
    if (isEscEvent(evt)) {
      evt.preventDefault();
      this._replacePopupToFilmCard();
    }
  }

  _handlePopupClsButtonClick() {
    this._replacePopupToFilmCard();
  }
}
