import UserStatusView from './view/user-status';
import SiteMenuView from './view/site-menu.js';
import StatsView from './view/stats.js';
import { generateFilm } from './mock/film';
import { generateFilter } from './mock/filter';
import { FILM_CARD_MOCK_COUNT} from './const';
import { render, RenderPosition } from './utils/render.js';
import BoardPresenter from './presenter/board';

const films = new Array(FILM_CARD_MOCK_COUNT).fill().map(generateFilm);
const filters = generateFilter(films);

const userLogoElement = document.querySelector('.header');
const siteMainElement = document.querySelector('.main');

render(userLogoElement, new UserStatusView(), RenderPosition.BEFOREEND);
render(siteMainElement, new SiteMenuView(filters), RenderPosition.BEFOREEND);

const boardPresenter = new BoardPresenter(siteMainElement);

boardPresenter.init(films);

const footerStaticsElement = document.querySelector('.footer__statistics');

render(footerStaticsElement, new StatsView(films), RenderPosition.BEFOREEND);
