import UserStatusView from './view/user-status';
import StatsView from './view/stats.js';
import { generateComment } from './mock/comments';
import CommentsModel from './model/comments.js';
import { generateFilm } from './mock/film';
import { FILM_CARD_MOCK_COUNT} from './const';
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

const boardPresenter = new BoardPresenter(siteMainElement, filmsModel, filterModel, commentsModel);
const filterPresenter = new FilterPresenter(siteMainElement, filterModel, filmsModel);

filterPresenter.init();

boardPresenter.init();

const footerStaticsElement = document.querySelector('.footer__statistics');

render(footerStaticsElement, new StatsView(films), RenderPosition.BEFOREEND);
