import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import duration from 'dayjs/plugin/duration';
import {isDatesEqual} from './task.js';

dayjs.extend(isBetween);
dayjs.extend(isSameOrBefore);
dayjs.extend(duration);

export const parseChartDate = (date) => dayjs(date).format('D MMMM YYYY');

export const getDatesInRange = (dateFrom, dateTo) => {
  const dates = [];
  const stepDate = new Date(dateFrom);

  while (dayjs(stepDate).isSameOrBefore(dateTo)) {
    dates.push(new Date(stepDate));
    stepDate.setDate(stepDate.getDate() + 1);
  }

  return dates;
};

export const countWatchedFilmsInDateRange = (dates, films) =>{
  const watchedFilms = dates.map((date) => films.filter((film) => isDatesEqual(film.watchedDate, date)).length);
  console.log(dates[0], films[0].watchedDate);
  let watchedFilmsCount = 0;
  watchedFilms.forEach((film) => watchedFilmsCount += film);
  return watchedFilmsCount;
};

export const defineUserStatus = (watchedFilmsCount) => {
  // const watchedFilmsCount = films.filter((film) => film.isAlreadyWatched === true).length;
  let status = '';
  switch(true){
    case (watchedFilmsCount === 0):
      break;
    case (watchedFilmsCount>0 && watchedFilmsCount<11):
      status = 'novice';
      break;
    case (watchedFilmsCount>10 && watchedFilmsCount<21):
      status = 'fan';
      break;
    case (watchedFilmsCount>20):
      status = 'movie buff';
      break;
  }

  return status;
};

// export const countWatchedFilmsInPeriod = (films, dateFrom, dateTo) =>
//   films.reduce((counter, film) => {
//     if (film.watchedDate === null) {
//       return 0;
//     }

//     // С помощью day.js проверям, сколько просмотренных фильмов
//     // попадают в диапазон дат
//     if (
//       dayjs(film.watchedDate).isSame(dateFrom) ||
//       dayjs(film.watchedDate).isBetween(dateFrom, dateTo) ||
//       dayjs(film.watchedDate).isSame(dateTo)
//     ) {
//       return counter + 1;
//     }

//     return counter;
//   }, 0);

export const countWatchedFilmsDuration = (dates, films) => {
  const watchedFilmsInDateRange = dates.map((date) => films.filter((film) => isDatesEqual(film.watchedDate, date)));
  let filmsDuration = 0;
  watchedFilmsInDateRange.forEach((film) => filmsDuration += dayjs.duration(film.duration, 'minutes'));
  // films.reduce((counter, film) => {
  //   if (film.watchedDate === null) {
  //     return counter = 0;
  //   }

  //   // С помощью day.js проверям, сколько просмотренных фильмов
  //   // попадают в диапазон дат
  //   if (
  //     dayjs(film.watchedDate).isSame(dateFrom) ||
  //     dayjs(film.watchedDate).isBetween(dateFrom, dateTo) ||
  //     dayjs(film.watchedDate).isSame(dateTo)
  //   ) {
  //     const filmDurationInMinutes = dayjs.duration(film.duration, 'minutes');
  //     counter += filmDurationInMinutes;
  const counterHours = Math.trunc(filmsDuration/60);
  const counterMinutes = filmsDuration%60;
  return `${counterHours}h ${counterMinutes}m`;
};

export const makeItemsUniq = (items) => [...new Set(items)];

export const countFilmsByGenre = (films, genre) =>
  films.filter((film) => film.genre.includes(genre)).length;

// export const countWatchedFilmsTopGenre = (films, dateFrom, dateTo) => {
//   const GenreCounters = {
//     Comedy: 0,
//     Drama: 0,
//     Western: 0,
//     Musical: 0,
//     Cartoon: 0,
//     Mystery: 0,
//   };
//   let TopGenre = '';

//   films.reduce((film) => {
//     if (film.watchedDate === null) {
//       return TopGenre;
//     }

//     if (
//       dayjs(film.watchedDate).isSame(dateFrom) ||
//       dayjs(film.watchedDate).isBetween(dateFrom, dateTo) ||
//       dayjs(film.watchedDate).isSame(dateTo)
//     ) {
//       film.genre.forEach((genre) => {
//         switch(genre){
//           case 'Comedy':
//             GenreCounters.Comedy += 1;
//             break;
//           case 'Drama':
//             GenreCounters.Drama += 1;
//             break;
//           case 'Western':
//             GenreCounters.Western += 1;
//             break;
//           case 'Musical':
//             GenreCounters.Musical += 1;
//             break;
//           case 'Cartoon':
//             GenreCounters.Cartoon += 1;
//             break;
//           case 'Mystery':
//             GenreCounters.Mystery += 1;
//             break;
//         }
//       });

//       const TopGenreCount = Math.max(GenreCounters.Comedy, GenreCounters.Drama, GenreCounters.Westert, GenreCounters.Musical, GenreCounters.Cartoon, GenreCounters.Mystery);
//       return TopGenre = GenreCounters.keys().forEach((key) => GenreCounters[key] === TopGenreCount ? key : '');
//     }

//     return TopGenre;
//   }, 0);
// };
