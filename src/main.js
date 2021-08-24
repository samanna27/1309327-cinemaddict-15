import { createUserStatusTemplate } from './view/user-status';
import { createSiteMenuTemplate } from './view/site-menu';
import { createSortingTemplate } from './view/sorting';
import { createAllFilmsListTemplate } from './view/all-films-list';
import { createShowMoreButtonTemplate } from './view/show-more-button';
import { createTopFilmsTemplate } from './view/top-rated-films';
import { createMostCommentedFilmsTemplate } from './view/most-commented-films';
import { createFilmCardTemplate } from './view/film-card';
import { createFilmPopupTemplate } from './view/film-pop-up';
import { createCommentTemplate } from './view/comments-in-popup';
import { createPopupGenreTemplate } from './view/film-genre';
import { generateFilm } from './mock/film';
import { generateFilter } from './mock/filter';
import { createStatsTemplate } from './view/stats.js';
import { FILM_CARD_COUNT_PER_STEP, FILM_CARD_MOCK_COUNT, TOP_COMMENTED_FILM_CARD_COUNT } from './const';

const films = new Array(FILM_CARD_MOCK_COUNT).fill().map(generateFilm);
const filters = generateFilter(films);

const render = (containter, template, place) => {
  containter.insertAdjacentHTML(place, template);
};

const userLogoElement = document.querySelector('.header__logo');
const siteMainElement = document.querySelector('.main');

render(userLogoElement, createUserStatusTemplate(), 'beforeend');
render(siteMainElement, createSiteMenuTemplate(filters), 'beforeend');
render(siteMainElement, createSortingTemplate(), 'beforeend');

const filmsElement = document.querySelector('.films');

render(filmsElement, createAllFilmsListTemplate(), 'beforeend');
const allFilmsContainerElement = document.querySelector('.films-list__container');
films.slice(0,FILM_CARD_COUNT_PER_STEP).forEach((film) => render(allFilmsContainerElement, createFilmCardTemplate(film), 'beforeend'));

render(filmsElement, createFilmPopupTemplate(films[0]), 'beforeend');

const genreInPopupContainterElement = document.querySelector('.film-details__table');
render(genreInPopupContainterElement, createPopupGenreTemplate(films[0]), 'beforeend');


const commentsInPopupContainterElement = document.querySelector('.film-details__bottom-container');
render(commentsInPopupContainterElement, createCommentTemplate(films[0]), 'beforeend');

if (films.length > FILM_CARD_COUNT_PER_STEP) {
  let renderedFilmsCount = FILM_CARD_COUNT_PER_STEP;

  render(allFilmsContainerElement, createShowMoreButtonTemplate(), 'beforeend');

  const showMoreButton = allFilmsContainerElement.querySelector('.films-list__show-more');

  showMoreButton.addEventListener('click', (evt) => {
    evt.preventDefault();
    films
      .slice(renderedFilmsCount, renderedFilmsCount + FILM_CARD_COUNT_PER_STEP)
      .forEach((film) => render(showMoreButton, createFilmCardTemplate(film), 'beforebegin'));

    renderedFilmsCount += FILM_CARD_COUNT_PER_STEP;

    if (renderedFilmsCount >= films.length) {
      showMoreButton.remove();
    }
  });
}

render(filmsElement, createTopFilmsTemplate(), 'beforeend');
const topFilmsContainerElement = document.querySelectorAll('.films-list__container')[1];
films.slice(0,TOP_COMMENTED_FILM_CARD_COUNT).forEach((film) => render(topFilmsContainerElement, createFilmCardTemplate(film), 'beforeend'));

render(filmsElement, createMostCommentedFilmsTemplate(), 'beforeend');
const mostCommentedFilmsContainerElement = document.querySelectorAll('.films-list__container')[2];
films.slice(0,TOP_COMMENTED_FILM_CARD_COUNT).forEach((film) => render(mostCommentedFilmsContainerElement, createFilmCardTemplate(film), 'beforeend'));

const footerStaticsElement = document.querySelector('.footer__statistics');

render(footerStaticsElement, createStatsTemplate(films), 'beforeend');
