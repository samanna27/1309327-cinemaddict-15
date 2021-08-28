import UserStatusView from './view/user-status';
import SiteMenuView from './view/site-menu.js';
import SortingView from './view/sorting';
import FilmsContainterView from './view/films-container';
import FilmsListContainerView from './view/films-list';
import ShowMoreButtonView from './view/show-more-button';
import TopFilmsView from './view/top-rated-films';
import MostCommentedFilmsView from './view/most-commented-films';
import FilmView from './view/film-card';
import FilmPopupView from './view/film-pop-up';
import CommentInPopupView from './view/comments-in-popup';
import FilmPopupGenreView from './view/film-genre';
import { generateFilm } from './mock/film';
import { generateFilter } from './mock/filter';
import StatsView from './view/stats.js';
import { FILM_CARD_COUNT_PER_STEP, FILM_CARD_MOCK_COUNT, TOP_COMMENTED_FILM_CARD_COUNT } from './const';
import { render, RenderPosition, isEscEvent } from './utils.js';

const films = new Array(FILM_CARD_MOCK_COUNT).fill().map(generateFilm);
const filters = generateFilter(films);

const userLogoElement = document.querySelector('.header');
const siteMainElement = document.querySelector('.main');

render(userLogoElement, new UserStatusView().getElement(), RenderPosition.BEFOREEND);
render(siteMainElement, new SiteMenuView(filters).getElement(), RenderPosition.BEFOREEND);
render(siteMainElement, new SortingView().getElement(), RenderPosition.BEFOREEND);

const renderFilm = (FilmsListComponent, film) => {
  const filmComponent = new FilmView(film);
  const filmPopupComponent = new FilmPopupView(film);

  const replacePopupToFilmCard = () => {
    FilmsListComponent.replaceChild(filmComponent.getElement(), filmPopupComponent.getElement());
  };

  const onPopupEscKeydown = (evt) => {
    if (isEscEvent(evt)) {
      evt.preventDefault();
      replacePopupToFilmCard();
      document.querySelector('body').classList.remove('hide-overflow');
      document.removeEventListener('keydown', onPopupEscKeydown);
    }
  };

  const replaceFilmCardToPopup = () => {
    FilmsListComponent.replaceChild(filmPopupComponent.getElement(), filmComponent.getElement());

    const genreInPopupContainterElement = document.querySelector('.film-details__table');
    render(genreInPopupContainterElement, new FilmPopupGenreView(films[0]).getElement(), RenderPosition.BEFOREEND);

    const commentsInPopupContainterElement = document.querySelector('.film-details__bottom-container');
    render(commentsInPopupContainterElement, new CommentInPopupView(films[0]).getElement(), RenderPosition.BEFOREEND);

    document.querySelector('body').classList.add('hide-overflow');
    document.addEventListener('keydown', onPopupEscKeydown);
  };

  filmComponent.getElement().querySelector('.film-card__poster').addEventListener('click', () => {
    replaceFilmCardToPopup();
  });
  filmComponent.getElement().querySelector('.film-card__title').addEventListener('click', () => {
    replaceFilmCardToPopup();
  });
  filmComponent.getElement().querySelector('.film-card__comments').addEventListener('click', () => {
    replaceFilmCardToPopup();
  });

  filmPopupComponent.getElement().querySelector('.film-details__close-btn').addEventListener('click', (evt) => {
    evt.preventDefault();
    replacePopupToFilmCard();
    document.querySelector('body').classList.remove('hide-overflow');
    document.removeEventListener('keydown', onPopupEscKeydown);
  });

  render(FilmsListComponent, filmComponent.getElement(), RenderPosition.BEFOREEND);
};

const FilmsContainerComponent = new FilmsContainterView();
const FilmsListContainerComponent = new FilmsListContainerView();

render(siteMainElement, FilmsContainerComponent.getElement(), RenderPosition.BEFOREEND);

render(FilmsContainerComponent.getElement().querySelector('.films-list'), FilmsListContainerComponent.getElement(), RenderPosition.BEFOREEND);
films.slice(0,FILM_CARD_COUNT_PER_STEP).forEach((film) => renderFilm(FilmsListContainerComponent.getElement(), film));

if (films.length > FILM_CARD_COUNT_PER_STEP) {
  let renderedFilmsCount = FILM_CARD_COUNT_PER_STEP;

  const showMoreButtonComponent = new ShowMoreButtonView();

  render(FilmsContainerComponent.getElement().querySelector('.films-list'), showMoreButtonComponent.getElement(), RenderPosition.BEFOREEND);

  showMoreButtonComponent.getElement().addEventListener('click', (evt) => {
    evt.preventDefault();
    films
      .slice(renderedFilmsCount, renderedFilmsCount + FILM_CARD_COUNT_PER_STEP)
      .forEach((film) => renderFilm(FilmsListContainerComponent.getElement(), film));

    renderedFilmsCount += FILM_CARD_COUNT_PER_STEP;

    if (renderedFilmsCount >= films.length) {
      showMoreButtonComponent.getElement().remove();
      showMoreButtonComponent.removeElement();
    }
  });
}

const TopFilmsComponent = new TopFilmsView();
render(FilmsContainerComponent.getElement(), TopFilmsComponent.getElement(), RenderPosition.BEFOREEND);
films.slice(0,TOP_COMMENTED_FILM_CARD_COUNT).forEach((film) => renderFilm(TopFilmsComponent.getElement().querySelector('.films-list__container'), film));

const MostCommentedFilmsComponent = new MostCommentedFilmsView();
render(FilmsContainerComponent.getElement(), MostCommentedFilmsComponent.getElement(), RenderPosition.BEFOREEND);
films.slice(0,TOP_COMMENTED_FILM_CARD_COUNT).forEach((film) => renderFilm(MostCommentedFilmsComponent.getElement().querySelector('.films-list__container'), film));

const footerStaticsElement = document.querySelector('.footer__statistics');

render(footerStaticsElement, new StatsView(films).getElement(), RenderPosition.BEFOREEND);
