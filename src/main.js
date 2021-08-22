import { createUserStatusTemplate } from './view/user-status';
import { createSiteMenuTemplate, createStatsTemplate } from './view/site-menu-and-stats';
import { createSortingTemplate } from './view/sorting';
import { createAllFilmsListTemplate } from './view/all-films-list';
import { createShowMoreButtonTemplate } from './view/show-more-button';
import { createTopFilmsTemplate } from './view/top-rated-films';
import { createMostCommentedFilmsTemplate } from './view/most-commented-films';
import { createFilmCardTemplate } from './view/film-card';
import { createFilmPopupTemplate } from './view/film-pop-up';
import { generateFilm } from './mock/film';
import { generateFilter } from './mock/filter-and-stats';

const FILM_CARD_COUNT_PER_STEP = 5;
const FILM_CARD_MOCK_COUNT = 20;
const TOP_COMMENTED_FILM_CARD_COUNT = 2;

const films = new Array(FILM_CARD_MOCK_COUNT).fill().map(generateFilm);
const filtersAndStats = generateFilter(films);

const render = (containter, template, place) => {
  containter.insertAdjacentHTML(place, template);
};

const userLogoElement = document.querySelector('.header__logo');
const siteMainElement = document.querySelector('.main');

render(userLogoElement, createUserStatusTemplate(), 'beforeend');
render(siteMainElement, createSiteMenuTemplate(filtersAndStats), 'beforeend');
render(siteMainElement, createSortingTemplate(), 'beforeend');

const filmsElement = document.querySelector('.films');

render(filmsElement, createAllFilmsListTemplate(), 'beforeend');
const allFilmsContainerElement = document.querySelector('.films-list__container');
for (let i = 0; i < Math.min(films.length, FILM_CARD_COUNT_PER_STEP); i++) {
  render(allFilmsContainerElement, createFilmCardTemplate(films[i]), 'beforeend');
}

render(filmsElement, createFilmPopupTemplate(films[0]), 'beforeend');

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
for (let i = 0; i < TOP_COMMENTED_FILM_CARD_COUNT; i++) {
  render(topFilmsContainerElement, createFilmCardTemplate(films[i]), 'beforeend');
}

render(filmsElement, createMostCommentedFilmsTemplate(), 'beforeend');
const mostCommentedFilmsContainerElement = document.querySelectorAll('.films-list__container')[2];
for (let i = 0; i < TOP_COMMENTED_FILM_CARD_COUNT; i++) {
  render(mostCommentedFilmsContainerElement, createFilmCardTemplate(films[i]), 'beforeend');
}

const footerStaticsElement = document.querySelector('.footer__statistics');

render(footerStaticsElement, createStatsTemplate(filtersAndStats[0]), 'beforeend');
