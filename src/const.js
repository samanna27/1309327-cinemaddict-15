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
const BLANK_COMMENT = {
  id: 0,
  emoji: '',
  date: '',
  author: '',
  text: '',
};
const BLANK_GENRE = [];

export {FILM_CARD_COUNT_PER_STEP, FILM_CARD_MOCK_COUNT, TOP_COMMENTED_FILM_CARD_COUNT, BLANK_FILM, BLANK_COMMENT, BLANK_GENRE};
