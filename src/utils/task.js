import dayjs from 'dayjs';

export const filmToFilterMap = {
  all: (films) => films.length,
  watchlist: (films) => films.filter((film) => film.isAddedToWatchlist).length,
  history: (films) => films.filter((task) => task.isAlreadyWatched).length,
  favorites: (films) => films.filter((task) => task.isFavorite).length,
};

const getWeightForNullDate = (dateA, dateB) => {
  if (dateA === null && dateB === null) {
    return 0;
  }

  if (dateA === null) {
    return 1;
  }

  if (dateB === null) {
    return -1;
  }

  return null;
};

export const sortFilmDateDown = (filmA, filmB) => {
  const weight = getWeightForNullDate(filmA.year, filmB.year);

  if (weight !== null) {
    return weight;
  }

  return dayjs(filmB.year).diff(dayjs(filmA.year));
};

export const sortFilmRatingDown = (filmA, filmB) => {
  const weight = getWeightForNullDate(filmA.rating, filmB.rating);

  if (weight !== null) {
    return weight;
  }

  return (filmB.rating-filmA.rating);
};
