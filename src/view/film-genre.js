export const createPopupGenreTemplate = (film = {}) => {
  const {
    genre = [],
  } = film;

  const popupGenreTemplate = [];
  if (genre.length !== 0) {
    genre.forEach((element) => popupGenreTemplate.push(`<span class="film-details__genre">${element}</span>`));
  } else {popupGenreTemplate.push('<span class="film-details__genre"></span>');}

  popupGenreTemplate.join('');

  return `<tr class="film-details__row">
  <td class="film-details__term">${genre.length !== 1 ? 'Genres' : 'Genre'}</td>
  <td class="film-details__cell">
  ${popupGenreTemplate}
  </tr>`;
};
