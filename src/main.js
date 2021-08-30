import UserStatusView from './view/user-status';
import SiteMenuView from './view/site-menu.js';
import SortingView from './view/sorting';
import BoardContainterView from './view/board';
import FilmsContainterView from './view/films-container';
import FilmsListContainerView from './view/films-list';
import ShowMoreButtonView from './view/show-more-button';
import TopFilmsView from './view/top-rated-films';
import NoFilmsView from './view/no-films-message';
import MostCommentedFilmsView from './view/most-commented-films';
import FilmView from './view/film-card';
import FilmPopupView from './view/film-pop-up';
import CommentInPopupView from './view/comments-in-popup';
import FilmPopupGenreView from './view/film-genre';
import StatsView from './view/stats.js';
import { generateFilm } from './mock/film';
import { generateFilter } from './mock/filter';
import { FILM_CARD_COUNT_PER_STEP, FILM_CARD_MOCK_COUNT, TOP_COMMENTED_FILM_CARD_COUNT } from './const';
import { isEscEvent } from './utils/common.js';
import { render, RenderPosition, replace, remove} from './utils/render.js';

const films = new Array(FILM_CARD_MOCK_COUNT).fill().map(generateFilm);
const filters = generateFilter(films);

const userLogoElement = document.querySelector('.header');
const siteMainElement = document.querySelector('.main');

render(userLogoElement, new UserStatusView(), RenderPosition.BEFOREEND);
render(siteMainElement, new SiteMenuView(filters), RenderPosition.BEFOREEND);

const renderFilm = (Place, film) => {
  const filmComponent = new FilmView(film);
  const filmPopupComponent = new FilmPopupView(film);
  const filmPopupGenreComponent = new FilmPopupGenreView(films[0]);
  const commentInPopupComponent = new CommentInPopupView(films[0]);

  const replacePopupToFilmCard = () => {
    replace(filmComponent, filmPopupComponent);
  };

  const onPopupEscKeydown = (evt) => {
    if (isEscEvent(evt)) {
      evt.preventDefault();
      replacePopupToFilmCard();
      document.querySelector('body').classList.remove('hide-overflow');
      document.removeEventListener('keydown', onPopupEscKeydown);
      remove(filmPopupGenreComponent);
    }
  };

  const replaceFilmCardToPopup = () => {
    replace(filmPopupComponent, filmComponent);

    document.querySelector('body').classList.add('hide-overflow');
    document.addEventListener('keydown', onPopupEscKeydown);

    const genreInPopupContainterElement = document.querySelector('.film-details__table');
    render(genreInPopupContainterElement, filmPopupGenreComponent, RenderPosition.BEFOREEND);

    const commentsInPopupContainterElement = document.querySelector('.film-details__bottom-container');
    render(commentsInPopupContainterElement, commentInPopupComponent, RenderPosition.BEFOREEND);
  };

  filmComponent.setClickHandler(() => {replaceFilmCardToPopup();});

  filmPopupComponent.setPopupClsButtonClickHandler(() => {
    replacePopupToFilmCard();
    document.querySelector('body').classList.remove('hide-overflow');
    document.removeEventListener('keydown', onPopupEscKeydown);
  });

  render(Place, filmComponent, RenderPosition.BEFOREEND);
};

const FilmsContainerComponent = new FilmsContainterView();
const FilmsListContainerComponent = new FilmsListContainerView();
const BoardContainterComponent = new BoardContainterView();

if (films.length === 0) {
  render(siteMainElement, new NoFilmsView(), RenderPosition.BEFOREEND);
} else {
  render(siteMainElement, new SortingView(), RenderPosition.BEFOREEND);
  render(siteMainElement, BoardContainterComponent, RenderPosition.BEFOREEND);
  render(BoardContainterComponent, FilmsContainerComponent, RenderPosition.BEFOREEND);

  render(FilmsContainerComponent, FilmsListContainerComponent, RenderPosition.BEFOREEND);
  films.slice(0,FILM_CARD_COUNT_PER_STEP).forEach((film) => renderFilm(FilmsListContainerComponent.getElement(), film));

  if (films.length > FILM_CARD_COUNT_PER_STEP) {
    let renderedFilmsCount = FILM_CARD_COUNT_PER_STEP;

    const showMoreButtonComponent = new ShowMoreButtonView();

    render(FilmsListContainerComponent, showMoreButtonComponent, RenderPosition.AFTEREND);
    showMoreButtonComponent.setClickHandler(() => {
      films
        .slice(renderedFilmsCount, renderedFilmsCount + FILM_CARD_COUNT_PER_STEP)
        .forEach((film) => renderFilm(FilmsListContainerComponent.getElement(), film));

      renderedFilmsCount += FILM_CARD_COUNT_PER_STEP;

      if (renderedFilmsCount >= films.length) {
        remove(showMoreButtonComponent);
      }
    });
  }
}

const TopFilmsComponent = new TopFilmsView();
render(BoardContainterComponent, TopFilmsComponent, RenderPosition.BEFOREEND);
films.slice(0,TOP_COMMENTED_FILM_CARD_COUNT).forEach((film) => renderFilm(TopFilmsComponent.getElement().querySelector('.films-list__container'), film));

const MostCommentedFilmsComponent = new MostCommentedFilmsView();
render(BoardContainterComponent, MostCommentedFilmsComponent, RenderPosition.BEFOREEND);
films.slice(0,TOP_COMMENTED_FILM_CARD_COUNT).forEach((film) => renderFilm(MostCommentedFilmsComponent.getElement().querySelector('.films-list__container'), film));

const footerStaticsElement = document.querySelector('.footer__statistics');

render(footerStaticsElement, new StatsView(films), RenderPosition.BEFOREEND);
