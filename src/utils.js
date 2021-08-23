const getRandomInteger = (a = 0, b = 1) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));

  return Math.floor(lower + Math.random() * (upper - lower + 1));
};

const filmToFilterMap = {
  all: (films) => films.length,
  watchlist: (films) => films.filter((film) => film.isAddedToWatchlist).length,
  history: (films) => films.filter((task) => task.isAlreadyWatched).length,
  favorites: (films) => films.filter((task) => task.isFavorite).length,
};

export {getRandomInteger, filmToFilterMap};
