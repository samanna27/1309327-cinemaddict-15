import { createUserStatusTemplate } from './view/user-status';
import { createSiteMenuTemplate } from './view/site-menu';
import { createSortingTemplate } from './view/sorting';
import { createAllFilmsListTemplate } from './view/all-films-list';
import { createShowMoreButtonTemplate } from './view/show-more-button';
import { createTopFilmsTemplate } from './view/top-rated-films';
import { createMostCommentedFilmsTemplate } from './view/most-commented-films';
import { createStatsTemplate } from './view/stats';
import { createFilmCardTemplate } from './view/film-card';
import { createFilmPopupTemplate } from './view/film-pop-up';

const FILM_CARD_COUNT = 5;
const TOP_COMMENTED_FILM_CARD_COUNT = 2;

const render = (containter, template, place) => {
  containter.insertAdjacentHTML(place, template);
};

const userLogoElement = document.querySelector('.header__logo');
const siteMainElement = document.querySelector('.main');

render(userLogoElement, createUserStatusTemplate(), 'beforeend');
render(siteMainElement, createSiteMenuTemplate(), 'beforeend');
render(siteMainElement, createSortingTemplate(), 'beforeend');

const filmsElement = document.querySelector('.films');

render(filmsElement, createAllFilmsListTemplate(), 'beforeend');
const allFilmsContainerElement = document.querySelector('.films-list__container');
for (let i = 0; i < FILM_CARD_COUNT; i++) {
  render(allFilmsContainerElement, createFilmCardTemplate(), 'beforeend');
}
render(filmsElement, createFilmPopupTemplate(), 'beforeend');

render(allFilmsContainerElement, createShowMoreButtonTemplate(), 'beforeend');

render(filmsElement, createTopFilmsTemplate(), 'beforeend');
const topFilmsContainerElement = document.querySelectorAll('.films-list__container')[1];
for (let i = 0; i < TOP_COMMENTED_FILM_CARD_COUNT; i++) {
  render(topFilmsContainerElement, createFilmCardTemplate(), 'beforeend');
}

render(filmsElement, createMostCommentedFilmsTemplate(), 'beforeend');
const mostCommentedFilmsContainerElement = document.querySelectorAll('.films-list__container')[2];
for (let i = 0; i < TOP_COMMENTED_FILM_CARD_COUNT; i++) {
  render(mostCommentedFilmsContainerElement, createFilmCardTemplate(), 'beforeend');
}

const footerStaticsElement = document.querySelector('.footer__statistics');

render(footerStaticsElement, createStatsTemplate(), 'beforeend');
