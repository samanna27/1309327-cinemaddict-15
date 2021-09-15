import FilmView from '../view/film-card';
import FilmPopupView from '../view/film-pop-up';
import CommentInPopupView from '../view/comments-in-popup';
import FilmPopupGenreView from '../view/film-genre';
import {render, RenderPosition, replace, remove} from '../utils/render.js';
import { isEscEvent } from '../utils/common.js';

const Mode = {
  DEFAULT: 'DEFAULT',
  POPUP: 'POPUP',
};

export default class Film {
  constructor(place, film, changeData, changeMode){
    this._filmsListComponent = place;
    this._changeData = changeData;
    this._changeMode = changeMode;

    this._filmComponent = null;
    this._filmPopupComponent = null;
    this._mode = Mode.DEFAULT;
    this._filmPopupGenreComponent = new FilmPopupGenreView(film);
    this._commentInPopupComponent = new CommentInPopupView(film);

    this._handleFilmCardClick = this._handleFilmCardClick.bind(this);
    this._handleAddedToWatchlistClick = this._handleAddedToWatchlistClick.bind(this);
    this._handleFavoriteClick = this._handleFavoriteClick.bind(this);
    this._handleAlreadyWatchedClick = this._handleAlreadyWatchedClick.bind(this);
    this._handlePopupClsButtonClick = this._handlePopupClsButtonClick.bind(this);
    this._escKeyDownHandler = this._escKeyDownHandler.bind(this);
  }

  init(film) {
    this._film = film;

    const prevFilmComponent = this._filmComponent;
    const prevFilmPopupComponent = this._filmPopupComponent;

    this._filmComponent = new FilmView(film);
    this._filmPopupComponent = new FilmPopupView(film);

    this._filmComponent.setClickHandler(this._handleFilmCardClick);
    this._filmComponent.setAddedToWatchlistClickHandler(this._handleAddedToWatchlistClick);
    this._filmComponent.setFavoriteClickHandler(this._handleFavoriteClick);
    this._filmComponent.setAlreadyWatchedClickHandler(this._handleAlreadyWatchedClick);
    this._filmPopupComponent.setPopupClsButtonClickHandler(this._handlePopupClsButtonClick);
    this._filmPopupComponent.setAddedToWatchlistClickHandler(this._handleAddedToWatchlistClick);
    this._filmPopupComponent.setFavoriteClickHandler(this._handleFavoriteClick);
    this._filmPopupComponent.setAlreadyWatchedClickHandler(this._handleAlreadyWatchedClick);

    if (prevFilmComponent === null || prevFilmPopupComponent === null) {
      render(this._filmsListComponent, this._filmComponent, RenderPosition.BEFOREEND);
      return;
    }

    if (this._mode === Mode.DEFAULT) {
      replace(this._filmComponent, prevFilmComponent);
    }

    if (this._mode === Mode.POPUP) {
      replace(this._filmPopupComponent, prevFilmPopupComponent);
      this._renderWholePopUp();
    }

    remove(prevFilmComponent);
    remove(prevFilmPopupComponent);
  }

  destroy() {
    remove(this._filmComponent);
    remove(this._filmPopupComponent);

  }

  _renderWholePopUp (){
    const genreInPopupContainterElement = document.querySelector('.film-details__table');
    render(genreInPopupContainterElement, this._filmPopupGenreComponent, RenderPosition.BEFOREEND);

    const commentsInPopupContainterElement = document.querySelector('.film-details__bottom-container');
    render(commentsInPopupContainterElement, this._commentInPopupComponent, RenderPosition.BEFOREEND);
  }

  resetView() {
    if (this._mode !== Mode.DEFAULT) {
      this._replacePopupToFilmCard();
    }
  }

  _replaceFilmCardToPopup() {
    replace(this._filmPopupComponent, this._filmComponent);
    this._renderWholePopUp();

    // const genreInPopupContainterElement = document.querySelector('.film-details__table');
    // render(genreInPopupContainterElement, this._filmPopupGenreComponent, RenderPosition.BEFOREEND);

    // const commentsInPopupContainterElement = document.querySelector('.film-details__bottom-container');
    // render(commentsInPopupContainterElement, this._commentInPopupComponent, RenderPosition.BEFOREEND);

    document.querySelector('body').classList.add('hide-overflow');

    document.addEventListener('keydown', this._escKeyDownHandler);
    this._changeMode();
    this._mode = Mode.POPUP;
  }

  _replacePopupToFilmCard() {
    replace(this._filmComponent, this._filmPopupComponent);
    document.querySelector('body').classList.remove('hide-overflow');
    document.removeEventListener('keydown', this._escKeyDownHandler);
    remove(this._filmPopupGenreComponent);
    this._mode = Mode.DEFAULT;
  }

  _handleFilmCardClick() {
    this._replaceFilmCardToPopup();
  }

  _handleFavoriteClick() {
    this._changeData(
      Object.assign(
        {},
        this._film,
        {
          isFavorite: !this._film.isFavorite,
        },
      ),
    );
  }

  _handleAddedToWatchlistClick() {
    this._changeData(
      Object.assign(
        {},
        this._film,
        {
          isAddedToWatchlist: !this._film.isAddedToWatchlist,
        },
      ),
    );
  }

  _handleAlreadyWatchedClick() {
    this._changeData(
      Object.assign(
        {},
        this._film,
        {
          isAlreadyWatched: !this._film.isAlreadyWatched,
        },
      ),
    );
  }

  _escKeyDownHandler(evt) {
    if (isEscEvent(evt)) {
      evt.preventDefault();
      this._commentInPopupComponent._reset(this._film);
      this._replacePopupToFilmCard();
    }
  }

  _handlePopupClsButtonClick(film) {
    this._changeData(film);
    this._replacePopupToFilmCard();
  }
}
