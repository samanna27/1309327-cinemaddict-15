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
import {sortFilmDateDown, sortFilmRatingDown} from '../utils/task.js';
import { FILM_CARD_COUNT_PER_STEP,  TOP_COMMENTED_FILM_CARD_COUNT, SortType } from '../const.js';

export default class Board {
  constructor(boardContainer) {
    this._boardContainer = boardContainer;
    this._renderedFilmCount = FILM_CARD_COUNT_PER_STEP;
    this._filmPresenter = new Map();
    this._topFilmPresenter = new Map();
    this._commentedFilmPresenter = new Map();
    this._currentSortType = SortType.DEFAULT;

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
    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);
  }

  init(boardFilms) {
    this._boardFilms = boardFilms.slice();
    this._sourcedBoardFilms = boardFilms.slice();

    render(this._boardContainer, this._boardComponent, RenderPosition.BEFOREEND);
    render(this._boardComponent, this._filmsContainerComponent, RenderPosition.BEFOREEND);
    render(this._filmsContainerComponent, this._filmsListComponent, RenderPosition.BEFOREEND);

    this._renderBoard();
  }

  _handleModeChange() {
    this._filmPresenter.forEach((presenter) => presenter.resetView());
    this._topFilmPresenter.forEach((presenter) => presenter.resetView());
    this._commentedFilmPresenter.forEach((presenter) => presenter.resetView());
  }

  _handleFilmChange(updatedFilm) {
    this._boardFilms = updateItem(this._boardFilms, updatedFilm);
    this._sourcedBoardFilms = updateItem(this._sourcedBoardFilms, updatedFilm);
    if(this._filmPresenter.has(updatedFilm.id)){
      this._filmPresenter.get(updatedFilm.id).init(updatedFilm);
    }
    if(this._topFilmPresenter.has(updatedFilm.id)){
      this._topFilmPresenter.get(updatedFilm.id).init(updatedFilm);
    }
    if(this._commentedFilmPresenter.has(updatedFilm.id)){
      this._commentedFilmPresenter.get(updatedFilm.id).init(updatedFilm);
    }
  }

  _sortFilms(sortType) {
    switch (sortType) {
      case SortType.DATE_DOWN:
        this._boardFilms.sort(sortFilmDateDown);
        break;
      case SortType.RATING_DOWN:
        this._boardFilms.sort(sortFilmRatingDown);
        break;
      default:
        this._boardFilms = this._sourcedBoardFilms.slice();
    }

    this._currentSortType = sortType;
  }

  _handleSortTypeChange(sortType) {
    if (this._currentSortType === sortType) {
      return;
    }

    this._sortFilms(sortType);
    this._clearFilmList();
    this._renderFilmList(this._filmsListComponent);
  }

  _renderSort() {
    render(this._boardComponent, this._sortComponent, RenderPosition.BEFOREBEGIN);
    this._sortComponent.setSortTypeChangeHandler(this._handleSortTypeChange);
  }

  _renderFilm(film, place) {
    if(place === this._topFilmsListComponent) {
      const filmPresenter = new FilmPresenter(place, film, this._handleFilmChange, this._handleModeChange);
      filmPresenter.init(film);
      this._topFilmPresenter.set(film.id, filmPresenter);
    } else if (place === this._mostCommentedFilmsListComponent) {
      const filmPresenter = new FilmPresenter(place, film, this._handleFilmChange, this._handleModeChange);
      filmPresenter.init(film);
      this._commentedFilmPresenter.set(film.id, filmPresenter);
    } else {
      // this._filmPresenter.has(film.id)){
      const filmPresenter = new FilmPresenter(place, film, this._handleFilmChange, this._handleModeChange);
      filmPresenter.init(film);
      this._filmPresenter.set(film.id, filmPresenter);
    }
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
    this._renderFilms(0, TOP_COMMENTED_FILM_CARD_COUNT, this._topFilmsListComponent);
  }

  _renderMostCommentedFilms(){
    render(this._boardComponent, this._mostCommentedFilmsComponent, RenderPosition.BEFOREEND);
    render(this._mostCommentedFilmsComponent, this._mostCommentedFilmsListComponent, RenderPosition.BEFOREEND);
    this._renderFilms(0, TOP_COMMENTED_FILM_CARD_COUNT, this._mostCommentedFilmsListComponent);
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
