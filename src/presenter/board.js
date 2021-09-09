import SortingView from '../view/sorting';
import BoardContainerView from '../view/board';
import FilmsContainterView from '../view/films-container';
import FilmsListContainerView from '../view/films-list';
import ShowMoreButtonView from '../view/show-more-button';
import NoFilmsView from '../view/no-films-message';
import TopFilmsView from '../view/top-rated-films';
import MostCommentedFilmsView from '../view/most-commented-films';
import FilmPresenter from './film.js';
import {render, RenderPosition, remove} from '../utils/render.js';
import {updateItem} from '../utils/common.js';
import { FILM_CARD_COUNT_PER_STEP,  TOP_COMMENTED_FILM_CARD_COUNT } from '../const.js';

export default class Board {
  constructor(boardContainer) {
    this._boardContainer = boardContainer;
    this._renderedFilmCount = FILM_CARD_COUNT_PER_STEP;
    this._filmPresenter = new Map();

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

    this._handleFilmChange = this._handleFilmChange.bind(this);
    this._handleModeChange = this._handleModeChange.bind(this);
    this._handleShowMoreButtonClick = this._handleShowMoreButtonClick.bind(this);
  }

  init(boardFilms) {
    this._boardFilms = boardFilms.slice();
    render(this._boardContainer, this._boardComponent, RenderPosition.BEFOREEND);
    render(this._boardComponent, this._filmsContainerComponent, RenderPosition.BEFOREEND);
    render(this._filmsContainerComponent, this._filmsListComponent, RenderPosition.BEFOREEND);

    this._renderBoard();
  }

  _handleModeChange() {
    this._filmPresenter.forEach((presenter) => presenter.resetView());
  }

  _handleFilmChange(updatedFilm) {
    this._boardFilms = updateItem(this._boardFilms, updatedFilm);
    this._filmPresenter.get(updatedFilm.id).init(updatedFilm);
  }

  _renderSort() {
    render(this._boardComponent, this._sortComponent, RenderPosition.BEFOREBEGIN);
  }

  _renderFilm(film, place) {
    const filmPresenter = new FilmPresenter(place, film, this._handleFilmChange, this._handleModeChange);
    filmPresenter.init(film);
    this._filmPresenter.set(film.id, filmPresenter);
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

  _clearFilmList() {
    this._filmPresenter.forEach((presenter) => presenter.destroy());
    this._filmPresenter.clear();
    this._renderedFilmCount = FILM_CARD_COUNT_PER_STEP;
    remove(this._showMoreButtonComponent);
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
