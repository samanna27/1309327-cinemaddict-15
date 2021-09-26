import SortingView from '../view/sorting';
import BoardContainerView from '../view/board';
import FilmsContainterView from '../view/films-container';
import FilmsListContainerView from '../view/films-list';
import ShowMoreButtonView from '../view/show-more-button';
import NoFilmsView from '../view/no-films-message';
import TopFilmsView from '../view/top-rated-films';
import MostCommentedFilmsView from '../view/most-commented-films';
import FilmPresenter from './film.js';
import {render, RenderPosition, remove, replace} from '../utils/render.js';
import {sortFilmDateDown, sortFilmRatingDown} from '../utils/task.js';
import {filter} from '../utils/filter.js';
import { FILM_CARD_COUNT_PER_STEP,  TOP_COMMENTED_FILM_CARD_COUNT, SortType, UpdateType, UserAction, FilterType } from '../const.js';

export default class Board {
  constructor(boardContainer, filmsModel, filterModel, commentsModel) {
    this._filmsModel = filmsModel;
    this._filterModel = filterModel;
    this._commentsModel = commentsModel;
    this._boardContainer = boardContainer;
    this._renderedFilmCount = FILM_CARD_COUNT_PER_STEP;
    this._filmPresenter = new Map();
    this._topFilmPresenter = new Map();
    this._commentedFilmPresenter = new Map();
    this._filterType = FilterType.ALL;
    this._currentSortType = SortType.DEFAULT;

    this._sortComponent = null;
    this._loadMoreButtonComponent = null;
    this._noFilmComponent = null;
    this._comments = this._commentsModel.getComments().slice();

    this._boardComponent = new BoardContainerView();
    this._filmsContainerComponent = new FilmsContainterView();
    this._filmsListComponent = new FilmsListContainerView();
    this._topFilmsListComponent = new FilmsListContainerView();
    this._mostCommentedFilmsListComponent = new FilmsListContainerView();
    this._topFilmsComponent = new TopFilmsView();
    this._mostCommentedFilmsComponent = new MostCommentedFilmsView();

    this._handleViewAction = this._handleViewAction.bind(this);
    this._handleModelEvent = this._handleModelEvent.bind(this);
    this._handleModeChange = this._handleModeChange.bind(this);
    this._handleShowMoreButtonClick = this._handleShowMoreButtonClick.bind(this);
    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);
  }

  init() {
    render(this._boardContainer, this._boardComponent, RenderPosition.BEFOREEND);
    render(this._boardComponent, this._filmsContainerComponent, RenderPosition.BEFOREEND);
    render(this._filmsContainerComponent, this._filmsListComponent, RenderPosition.BEFOREEND);

    this._filmsModel.addObserver(this._handleModelEvent);
    this._filterModel.addObserver(this._handleModelEvent);
    this._commentsModel.addObserver(this._handleModelEvent);

    this._renderBoard();
  }

  destroy() {
    this._clearBoard({resetRenderedFilmCount: true, resetSortType: true});

    remove(this._filmsListComponent);
    remove(this._filmsContainerComponent);
    remove(this._boardComponent);
    remove(this._topFilmsListComponent);
    remove(this._mostCommentedFilmsListComponent);
    // this._topFilmsComponent = new TopFilmsView();
    // this._mostCommentedFilmsComponent = new MostCommentedFilmsView();

    this._filmsModel.removeObserver(this._handleModelEvent);
    this._filterModel.removeObserver(this._handleModelEvent);
  }

  _getFilms() {
    this._filterType = this._filterModel.getFilter();
    const films = this._filmsModel.getFilms();
    const filteredFilms = filter[this._filterType](films);

    switch (this._currentSortType) {
      case SortType.DATE_DOWN:
        return filteredFilms.sort(sortFilmDateDown);
      case SortType.RATING_DOWN:
        return filteredFilms.sort(sortFilmRatingDown);
    }

    return filteredFilms;
  }

  _handleModeChange() {
    this._filmPresenter.forEach((presenter) => presenter.resetView());
    this._topFilmPresenter.forEach((presenter) => presenter.resetView());
    this._commentedFilmPresenter.forEach((presenter) => presenter.resetView());
  }

  _handleViewAction(actionType, updateType, update) {
    switch (actionType) {
      case UserAction.UPDATE_FILM:
        this._filmsModel.updateFilm(updateType, update);
        break;
      case UserAction.ADD_COMMENT:
        this._commentsModel.addComment(updateType, update);
        break;
      case UserAction.DELETE_COMMENT:
        this._commentsModel.deleteComment(updateType, update);
        break;
    }
  }

  _handleModelEvent(updateType, data) {
    switch (updateType) {
      case UpdateType.PATCH:
        if(this._filmPresenter.has(data.id)){
          this._filmPresenter.get(data.id).init(data);
        }
        if(this._topFilmPresenter.has(data.id)){
          this._topFilmPresenter.get(data.id).init(data);
        }
        if(this._commentedFilmPresenter.has(data.id)){
          this._commentedFilmPresenter.get(data.id).init(data);
        }
        break;
      case UpdateType.MINOR:
        this._clearBoard();
        this._renderBoard(updateType);
        break;
      case UpdateType.MAJOR:
        this._clearBoard({resetRenderedFilmCount: true, resetSortType: true});
        this._renderBoard(updateType);
        break;
    }
  }

  _handleSortTypeChange(sortType) {
    if (this._currentSortType === sortType) {
      return;
    }

    this._currentSortType = sortType;

    const prevSortComponent = this._sortComponent;

    this._sortComponent = new SortingView(this._currentSortType);

    replace(this._sortComponent, prevSortComponent);
    this._sortComponent.setSortTypeChangeHandler(this._handleSortTypeChange);

    this._clearFilmList();
    this._renderFilmList(this._filmsListComponent, this._comments);
  }

  _renderSort() {
    if (this._sortComponent !== null) {
      this._sortComponent = null;
    }

    this._sortComponent = new SortingView(this._currentSortType);

    this._sortComponent.setSortTypeChangeHandler(this._handleSortTypeChange);

    render(this._boardComponent, this._sortComponent, RenderPosition.BEFOREBEGIN);
  }

  _renderFilm(film, comments, place) {
    if(place === this._topFilmsListComponent) {
      const filmPresenter = new FilmPresenter(film, comments, place, this._handleViewAction, this._handleModeChange);
      filmPresenter.init(film, comments);
      this._topFilmPresenter.set(film.id, filmPresenter);
    } else if (place === this._mostCommentedFilmsListComponent) {
      const filmPresenter = new FilmPresenter(film, comments, place, this._handleViewAction, this._handleModeChange);
      filmPresenter.init(film, comments);
      this._commentedFilmPresenter.set(film.id, filmPresenter);
    } else {
      const filmPresenter = new FilmPresenter(film, comments, place, this._handleViewAction, this._handleModeChange);
      filmPresenter.init(film, comments, place);
      this._filmPresenter.set(film.id, filmPresenter);
    }
  }

  _renderFilms(films, comments, place){
    films.forEach((film) => this._renderFilm(film, comments, place));
  }

  _renderNoFilms() {
    this._noFilmComponent = new NoFilmsView(this._filterType);
    render(this._boardComponent, this._noFilmComponent, RenderPosition.AFTERBEGIN);

  }

  _handleShowMoreButtonClick() {
    const place = this._filmsListComponent;
    const filmCount = this._getFilms().length;
    const newRenderedFilmCount = Math.min(filmCount, this._renderedFilmCount + FILM_CARD_COUNT_PER_STEP);
    const films = this._getFilms().slice(this._renderedFilmCount, newRenderedFilmCount);

    this._renderFilms(films, this._comments, place);
    this._renderedFilmCount = newRenderedFilmCount;

    if (this._renderedFilmCount >= filmCount){
      remove(this._showMoreButtonComponent);
    }
  }

  _renderShowMoreButton() {
    if (this._showMoreButtonComponent !== null) {
      this._showMoreButtonComponent = null;
    }

    this._showMoreButtonComponent = new ShowMoreButtonView();
    this._showMoreButtonComponent.setClickHandler(this._handleShowMoreButtonClick);

    render(this._filmsContainerComponent, this._showMoreButtonComponent, RenderPosition.BEFOREEND);
  }

  _clearFilmList() {
    this._filmPresenter.forEach((presenter) => presenter.destroy());
    this._filmPresenter.clear();
    this._renderedFilmCount = FILM_CARD_COUNT_PER_STEP;
    remove(this._showMoreButtonComponent);
  }

  _renderFilmList(place, comments){
    const filmCount = this._getFilms().length;
    const films = this._getFilms().slice(0, Math.min(filmCount, FILM_CARD_COUNT_PER_STEP));

    this._renderFilms(films, comments, place);
    if (filmCount > FILM_CARD_COUNT_PER_STEP) {
      this._renderShowMoreButton();
    }
  }

  _renderTopFilms(){
    render(this._boardComponent, this._topFilmsComponent, RenderPosition.BEFOREEND);
    render(this._topFilmsComponent, this._topFilmsListComponent, RenderPosition.BEFOREEND);
    const filmCount = this._getFilms().length;
    const films = this._getFilms().slice(0, Math.min(filmCount, TOP_COMMENTED_FILM_CARD_COUNT));

    this._renderFilms(films, this._comments, this._topFilmsListComponent);
  }

  _renderMostCommentedFilms(){
    render(this._boardComponent, this._mostCommentedFilmsComponent, RenderPosition.BEFOREEND);
    render(this._mostCommentedFilmsComponent, this._mostCommentedFilmsListComponent, RenderPosition.BEFOREEND);
    const filmCount = this._getFilms().length;
    const films = this._getFilms().slice(0, Math.min(filmCount, TOP_COMMENTED_FILM_CARD_COUNT));

    this._renderFilms(films, this._comments, this._mostCommentedFilmsListComponent);
  }

  _clearBoard({resetRenderedFilmCount = false, resetSortType = false} = {}) {
    const filmCount = this._getFilms().length;

    this._filmPresenter.forEach((presenter) => presenter.destroy());
    this._filmPresenter.clear();

    remove(this._sortComponent);
    remove(this._showMoreButtonComponent);

    if (this._noFilmComponent){
      remove(this._noFilmComponent);
    }

    if (resetRenderedFilmCount) {
      this._renderedFilmCount = FILM_CARD_COUNT_PER_STEP;
    } else {
      // На случай, если перерисовка доски вызвана
      // уменьшением количества задач (например, удаление или перенос в архив)
      // нужно скорректировать число показанных задач
      this._renderedTaskCount = Math.min(filmCount, this._renderedFilmCount);
    }

    if (resetSortType) {
      this._currentSortType = SortType.DEFAULT;
    }
  }

  _renderBoard(updateType) {
    const films = this._getFilms();
    const filmCount = films.length;

    if (filmCount === 0) {
      this._renderNoFilms();
      return;
    }

    this._renderSort();
    this._renderFilms(films.slice(0, Math.min(filmCount, this._renderedFilmCount)), this._comments, this._filmsListComponent);

    if (filmCount > this._renderedFilmCount) {
      this._renderShowMoreButton();
    }

    if(updateType !== 'MAJOR' && updateType !== 'MINOR') {
      this._renderTopFilms();
      this._renderMostCommentedFilms();
    }
  }
}
