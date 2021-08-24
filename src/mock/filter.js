const filmToFilterMap = {
  all: (films) => films.length,
  watchlist: (films) => films.filter((film) => film.isAddedToWatchlist).length,
  history: (films) => films.filter((task) => task.isAlreadyWatched).length,
  favorites: (films) => films.filter((task) => task.isFavorite).length,
};

export const generateFilter = (films) => Object.entries(filmToFilterMap).map(
  ([filterName, countFilms]) => ({
    name: filterName,
    count: countFilms(films),
  }),
);
