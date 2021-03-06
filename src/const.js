const FILM_CARD_COUNT_PER_STEP = 5;
const FILM_CARD_MOCK_COUNT = 20;
const TOP_COMMENTED_FILM_CARD_COUNT = 2;
const BLANK_FILM = {
  title: '',
  originalTitle: '',
  poster: null,
  fullDescription: [],
  rating: 0,
  director: [],
  writers: [],
  actors: [],
  releaseDate: '',
  duration: '',
  country: [],
  isAddedToWatchlist:  false,
  isAlreadyWatched: false,
  isFavorite: false,
};
const BLANK_GENRE = [];

const COMMENTS_QUANTITY = 100;
const COMMENTS_IN_FILM = 5;

export {FILM_CARD_COUNT_PER_STEP, FILM_CARD_MOCK_COUNT, TOP_COMMENTED_FILM_CARD_COUNT, BLANK_FILM, BLANK_GENRE, COMMENTS_QUANTITY, COMMENTS_IN_FILM};

export const SortType = {
  DEFAULT: 'default',
  DATE_DOWN: 'date-down',
  RATING_DOWN: 'rating-down',
};

export const UserAction = {
  UPDATE_FILM: 'UPDATE_FILM',
  ADD_COMMENT: 'ADD_COMMENT',
  DELETE_COMMENT: 'DELETE_COMMENT',
};

export const UpdateType = {
  PATCH: 'PATCH',
  MINOR: 'MINOR',
  MAJOR: 'MAJOR',
};

export const FilterType = {
  ALL: 'all',
  ADDED_TO_WATCHLIST: 'addedToWatchlist',
  ALREADY_WATCHED: 'alreadyWatched',
  FAVORITES: 'favorites',
};
