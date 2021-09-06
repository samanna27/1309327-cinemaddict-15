import SortingView from '../view/sorting';
import BoardContainerView from '../view/board';
import FilmsContainterView from '../view/films-container';
import FilmsListContainerView from '../view/films-list';
import ShowMoreButtonView from '../view/show-more-button';
import NoFilmsView from '../view/no-films-message';
// import FilmView from '../view/film-card';
// import FilmPopupView from '../view/film-pop-up';
// import CommentInPopupView from '../view/comments-in-popup';
// import FilmPopupGenreView from '../view/film-genre';
import TopFilmsView from '../view/top-rated-films';
import MostCommentedFilmsView from '../view/most-commented-films';
import FilmPresenter from './film.js';
// import { isEscEvent } from '../utils/common.js';
import {render, RenderPosition, remove} from '../utils/render.js';
import { FILM_CARD_COUNT_PER_STEP,  TOP_COMMENTED_FILM_CARD_COUNT } from '../const.js';

export default class Board {
  constructor(boardContainer) {
    this._boardContainer = boardContainer;
    this._renderedFilmCount = FILM_CARD_COUNT_PER_STEP;

    this._boardComponent = new BoardContainerView();
    this._sortComponent = new SortingView();
    this._filmsContainerComponent = new FilmsContainterView();
    this._filmsListComponent = new FilmsListContainerView();
    this._topFilmsListComponent = new FilmsListContainerView();
    this._mostCommentedFilmsListComponent = new FilmsListContainerView();
    this._noFilmComponent = new NoFilmsView();
    this._topFilmsComponent = new TopFilmsView();
    this._mostCommentedFilmsComponent = new MostCommentedFilmsView();
    this._showMoreButtonComponent = new ShowMoreButtonView();

    this._handleShowMoreButtonClick = this._handleShowMoreButtonClick.bind(this);
  }

  init(boardFilms) {
    this._boardFilms = boardFilms.slice();
    render(this._boardContainer, this._boardComponent, RenderPosition.BEFOREEND);
    render(this._boardComponent, this._filmsContainerComponent, RenderPosition.BEFOREEND);
    render(this._filmsContainerComponent, this._filmsListComponent, RenderPosition.BEFOREEND);

    this._renderBoard();
  }

  _renderSort() {
    render(this._boardComponent, this._sortComponent, RenderPosition.BEFOREBEGIN);
  }

  _renderFilm(film, place) {
    // const filmComponent = new FilmView(film);
    // const filmPopupComponent = new FilmPopupView(film);
    // const filmPopupGenreComponent = new FilmPopupGenreView(film);
    // const commentInPopupComponent = new CommentInPopupView(film);

    // const replacePopupToFilmCard = () => {
    //   replace(filmComponent, filmPopupComponent);
    // };

    // const onPopupEscKeydown = (evt) => {
    //   if (isEscEvent(evt)) {
    //     evt.preventDefault();
    //     replacePopupToFilmCard();
    //     document.querySelector('body').classList.remove('hide-overflow');
    //     document.removeEventListener('keydown', onPopupEscKeydown);
    //     remove(filmPopupGenreComponent);
    //   }
    // };

    // const replaceFilmCardToPopup = () => {
    //   replace(filmPopupComponent, filmComponent);

    //   const genreInPopupContainterElement = document.querySelector('.film-details__table');
    //   render(genreInPopupContainterElement, filmPopupGenreComponent, RenderPosition.BEFOREEND);

    //   const commentsInPopupContainterElement = document.querySelector('.film-details__bottom-container');
    //   render(commentsInPopupContainterElement, commentInPopupComponent, RenderPosition.BEFOREEND);

    //   document.querySelector('body').classList.add('hide-overflow');
    //   document.addEventListener('keydown', onPopupEscKeydown);
    // };

    // filmComponent.setClickHandler(() => {replaceFilmCardToPopup();});

    // filmPopupComponent.setPopupClsButtonClickHandler(() => {
    //   replacePopupToFilmCard();
    //   document.querySelector('body').classList.remove('hide-overflow');
    //   document.removeEventListener('keydown', onPopupEscKeydown);
    // });

    // render(place, filmComponent, RenderPosition.BEFOREEND);
    // const filmPresenter = new FilmPresenter(this._filmsListComponent, film);
    const filmPresenter = new FilmPresenter(place, film);
    filmPresenter.init(film);
  }

  _renderFilms(from, to, place) {
    this._boardFilms
      .slice(from, to)
      .forEach((boardFilm) => this._renderFilm(boardFilm, place));
  }

  _renderNoFilms() {
    render(this._boardComponent, this._noFilmComponent, RenderPosition.AFTERBEGIN);

  }

  _handleShowMoreButtonClick() {
    this._renderFilms(this._renderedFilmCount, this._renderedFilmCount + FILM_CARD_COUNT_PER_STEP, this._filmsListComponent);
    this._renderedFilmCount+=FILM_CARD_COUNT_PER_STEP;

    if (this._renderedFilmCount >= this._boardFilms.length){
      remove(this._showMoreButtonComponent);
    }
  }

  _renderShowMoreButton() {
    render(this._filmsContainerComponent, this._showMoreButtonComponent, RenderPosition.BEFOREEND);

    this._showMoreButtonComponent.setClickHandler(this._handleShowMoreButtonClick);
  }

  _renderFilmList(place){
    this._renderFilms(0, Math.min(this._boardFilms.length, FILM_CARD_COUNT_PER_STEP), place);
    if (this._boardFilms.length > FILM_CARD_COUNT_PER_STEP) {
      this._renderShowMoreButton();
    }
  }

  _renderTopFilms(){
    render(this._boardComponent, this._topFilmsComponent, RenderPosition.BEFOREEND);
    render(this._topFilmsComponent, this._topFilmsListComponent, RenderPosition.BEFOREEND);
    this._renderFilms(0,TOP_COMMENTED_FILM_CARD_COUNT, this._topFilmsListComponent);
  }

  _renderMostCommentedFilms(){
    render(this._boardComponent, this._mostCommentedFilmsComponent, RenderPosition.BEFOREEND);
    render(this._mostCommentedFilmsComponent, this._mostCommentedFilmsListComponent, RenderPosition.BEFOREEND);
    this._renderFilms(0,TOP_COMMENTED_FILM_CARD_COUNT, this._mostCommentedFilmsListComponent);
  }

  _renderBoard() {
    if (this._boardFilms.length === 0) {
      render(this._renderNoFilms);
      return;
    }

    this._renderSort();
    this._renderFilmList(this._filmsListComponent);
    this._renderTopFilms();
    this._renderMostCommentedFilms();
  }
}
