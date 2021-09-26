import UserStatusView from './view/user-status';
import FilmStatisticsView from './view/film-statistics.js';
import StatsView from './view/stats.js';
import { generateComment } from './mock/comments';
import CommentsModel from './model/comments.js';
import { generateFilm } from './mock/film';
import { FILM_CARD_MOCK_COUNT} from './const';
// import { FILM_CARD_MOCK_COUNT, FilterType, UpdateType} from './const';
import { render, RenderPosition } from './utils/render.js';
import BoardPresenter from './presenter/board';
import FilterPresenter from './presenter/filter.js';
import FilmsModel from './model/movies.js';
import FilterModel from './model/filter.js';

const films = new Array(FILM_CARD_MOCK_COUNT).fill().map(generateFilm);

let commentsQuantity = 0;
const comments = new Array(commentsQuantity).fill();
films.forEach((film) => {
  commentsQuantity += film.commentsIds.length;
  film.commentsIds.forEach((id)=> comments.push(generateComment(id)));
});

const filmsModel = new FilmsModel();
filmsModel.setFilms(films);

const filterModel = new FilterModel();

const commentsModel = new CommentsModel();
commentsModel.setComments(comments);

const userLogoElement = document.querySelector('.header');
const siteMainElement = document.querySelector('.main');

render(userLogoElement, new UserStatusView(), RenderPosition.BEFOREEND);

const filterPresenter = new FilterPresenter(siteMainElement, filterModel, filmsModel);
export const boardPresenter = new BoardPresenter(siteMainElement, filmsModel, filterModel, commentsModel);

filterPresenter.init();

export let filmStatisticsViewComponent = null;

export const siteMenuElement = document.querySelector('.main-navigation__additional');

export const handleSiteMenuClick = () => {
  document.querySelector('.main-navigation__item').classList.remove('main-navigation__item--active');
  siteMenuElement.classList.add('main-navigation__item--active');
  boardPresenter.destroy();
  filmStatisticsViewComponent = new FilmStatisticsView(filmsModel.getFilms());

  render(siteMainElement, filmStatisticsViewComponent, RenderPosition.BEFOREEND);
  filterPresenter._filterComponent.setFilterTypeChangeHandler(filterPresenter.handleFilterTypeChange);
  siteMenuElement.removeEventListener('click', handleSiteMenuClick);
  // if (filterPresenter._filterModel.getFilter() === evt.target.id) {
  // switch (evt.target.id) {
  //   case FilterType.ALL_MOVIES:
  //     filterModel.setFilter(UpdateType.MAJOR, FilterType.ALL);
  //     boardPresenter.init();
  //     remove(filmStatisticsViewComponent);
  //     // boardPresenter.destroy();
  //     break;
  //   case FilterType.FAVORITES:
  //     boardPresenter.init();
  //     remove(filmStatisticsViewComponent);
  //     break;
  //   case FilterType.ADDED_TO_WATCH_LIST:
  //     boardPresenter.init();
  //     remove(filmStatisticsViewComponent);
  //     break;
  //   case FilterType.ALREADY_WATCHED:
  //     boardPresenter.init();
  //     remove(filmStatisticsViewComponent);
  //     break;
  //   case FilterType.STATISTICS:
  //     siteMenuElement.querySelector('.main-navigation__additional').classList.add('main-navigation__item--active');
  //     console.log('does it work here?');
  //     boardPresenter.destroy();
  //     filmStatisticsViewComponent = new FilmStatisticsView(filmsModel.getFilms());
  //     render(siteMainElement, filmStatisticsViewComponent, RenderPosition.BEFOREEND);
  //     break;
  // }
};

// siteMenuElement.querySelector('main-navigation__additional').classList.add('main-navigation__item--active');
// addEventListener('click', handleSiteMenuClick());
boardPresenter.init();

siteMenuElement.addEventListener('click', handleSiteMenuClick);

const footerStaticsElement = document.querySelector('.footer__statistics');

render(footerStaticsElement, new StatsView(films), RenderPosition.BEFOREEND);
