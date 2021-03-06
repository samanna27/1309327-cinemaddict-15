import FilmView from '../view/film-card';
import FilmPopupView from '../view/film-pop-up';
import CommentInPopupView from '../view/comments-in-popup';
import FilmPopupGenreView from '../view/film-genre';
import {render, RenderPosition, replace, remove} from '../utils/render.js';
import {UserAction, UpdateType} from '../const.js';
import { isEscEvent } from '../utils/common.js';
import {nanoid} from 'nanoid';

const Mode = {
  DEFAULT: 'DEFAULT',
  POPUP: 'POPUP',
};

export default class Film {
  constructor(film, comments, place, changeData, changeMode){
    this._filmsListComponent = place;
    this._film = film;
    this._commentToDeleteID = null;
    this._newComment = null;
    this._changeData = changeData;
    this._changeMode = changeMode;

    this._filmComponent = null;
    this._filmPopupComponent = null;
    this._mode = Mode.DEFAULT;
    this._filmPopupGenreComponent = new FilmPopupGenreView(film.genre);
    this._comments = comments;
    this._commentInPopupComponent = new CommentInPopupView(this._comments, this._film);

    this._handleFilmCardClick = this._handleFilmCardClick.bind(this);
    this._handleAddedToWatchlistClick = this._handleAddedToWatchlistClick.bind(this);
    this._handleFavoriteClick = this._handleFavoriteClick.bind(this);
    this._handleAlreadyWatchedClick = this._handleAlreadyWatchedClick.bind(this);
    this._handlePopupClsButtonClick = this._handlePopupClsButtonClick.bind(this);
    this._escKeyDownHandler = this._escKeyDownHandler.bind(this);
    this.createNewCommentHandler=this.createNewCommentHandler.bind(this);
    this.deleteCommentHandler = this.deleteCommentHandler.bind(this);
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
    this._commentInPopupComponent.setCommentSubmitHandler(this.createNewCommentHandler);
    this._commentInPopupComponent.setCommentDeleteHandler(this.deleteCommentHandler);

    if (prevFilmComponent === null || prevFilmPopupComponent === null) {
      render(this._filmsListComponent, this._filmComponent, RenderPosition.BEFOREEND);
      return;
    }

    if (this._mode === Mode.DEFAULT) {
      replace(this._filmComponent, prevFilmComponent);
      remove(prevFilmComponent);
    }

    if (this._mode === Mode.POPUP) {
      replace(this._filmPopupComponent, prevFilmPopupComponent);
      this._renderWholePopUp();
      replace(this._filmComponent, prevFilmComponent);
    }

    remove(prevFilmPopupComponent);
  }

  destroy() {
    remove(this._filmComponent);
    remove(this._filmPopupComponent);
  }

  _renderWholePopUp (){
    const genreInPopupContainerElement = document.querySelector('.film-details__table');
    render(genreInPopupContainerElement, this._filmPopupGenreComponent, RenderPosition.BEFOREEND);

    const commentsInPopupContainerElement = document.querySelector('.film-details__bottom-container');
    render(commentsInPopupContainerElement, this._commentInPopupComponent, RenderPosition.BEFOREEND);
  }

  restoreHandlers() {
    this._commentInPopupComponent.setCommentSubmitHandler(this.createNewCommentHandler);
    this._commentInPopupComponent.setCommentDeleteHandler(this.deleteCommentHandler);

  }

  createNewCommentHandler(newComment){
    newComment.id = nanoid();
    this._film.commentsIds.push(newComment.id);
    this._newComment = newComment;

    this._comments.push(newComment);

    this._changeData(
      UserAction.ADD_COMMENT,
      UpdateType.PATCH,
      Object.assign(
        {},
        this._film,
        this._newComments,
      ),
    );

    const prevCommentInPopupComponent = this._commentInPopupComponent;
    const updatedCommentInPopupComponent = new CommentInPopupView(this._comments, this._film);

    replace(updatedCommentInPopupComponent, prevCommentInPopupComponent);
    this._commentInPopupComponent = updatedCommentInPopupComponent;

    this._commentInPopupComponent.restoreHandlers();
    this.restoreHandlers();
  }

  deleteCommentHandler(commentToDeleteId){
    const prevCommentInPopupComponent = this._commentInPopupComponent;

    this._commentToDeleteId = {commentToDeleteId};

    const commentIndex = this._film.commentsIds.findIndex((commentId) => commentId === commentToDeleteId);
    this._film.commentsIds.splice(commentIndex, 1);

    this._changeData(
      UserAction.DELETE_COMMENT,
      UpdateType.PATCH,
      Object.assign(
        {},
        this._film,
        this._commentToDeleteId,
      ),
    );
    this._commentInPopupComponent.restoreHandlers();
    this.restoreHandlers();

    const updatedCommentInPopupComponent = new CommentInPopupView(this._comments, this._film);
    replace(updatedCommentInPopupComponent, prevCommentInPopupComponent);

    this._commentInPopupComponent = updatedCommentInPopupComponent;
    this._commentInPopupComponent.restoreHandlers();
    this.restoreHandlers();
  }

  resetView() {
    if (this._mode !== Mode.DEFAULT) {
      this._replacePopupToFilmCard();
    }
  }

  _replaceFilmCardToPopup() {
    const popupRenderPlace = document.querySelector('.footer');
    render(popupRenderPlace, this._filmPopupComponent, RenderPosition.AFTEREND);
    this._renderWholePopUp();

    document.querySelector('body').classList.add('hide-overflow');

    document.addEventListener('keydown', this._escKeyDownHandler);

    this._filmPopupComponent.setAddedToWatchlistClickHandler(this._handleAddedToWatchlistClick);
    this._filmPopupComponent.setFavoriteClickHandler(this._handleFavoriteClick);
    this._filmPopupComponent.setAlreadyWatchedClickHandler(this._handleAlreadyWatchedClick);
    this._filmPopupComponent.setPopupClsButtonClickHandler(this._handlePopupClsButtonClick);

    this._changeMode();
    this._mode = Mode.POPUP;
  }

  _replacePopupToFilmCard() {
    remove(this._filmPopupComponent);

    document.querySelector('body').classList.remove('hide-overflow');
    document.removeEventListener('keydown', this._escKeyDownHandler);
    this._mode = Mode.DEFAULT;
  }

  _handleFilmCardClick() {
    this._replaceFilmCardToPopup();
  }

  _handleFavoriteClick() {
    this._changeData(
      UserAction.UPDATE_FILM,
      (this._mode === Mode.POPUP? UpdateType.PATCH: UpdateType.MINOR),
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
      UserAction.UPDATE_FILM,
      (this._mode === Mode.POPUP? UpdateType.PATCH: UpdateType.MINOR),
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
      UserAction.UPDATE_FILM,
      (this._mode === Mode.POPUP? UpdateType.PATCH: UpdateType.MINOR),
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
      // this._commentInPopupComponent._reset(this._film);
      this._replacePopupToFilmCard();
    }
  }

  _handlePopupClsButtonClick(film) {
    this._changeData(
      UserAction.UPDATE_FILM,
      UpdateType.PATCH,
      film,
    );
    this._replacePopupToFilmCard();
  }
}
