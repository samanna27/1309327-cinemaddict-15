import AbstractObserver from '../utils/abstract-observer.js';

export default class Films extends AbstractObserver {
  constructor() {
    super();
    this._films = [];
  }

  setFilms(films) {
    this._films = films.slice();
  }

  getFilms() {
    return this._films;
  }

  updateFilm(updateType, update) {
    const index = this._films.findIndex((film) => film.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t update unexisting film');
    }

    this._films = [
      ...this._films.slice(0, index),
      update,
      ...this._films.slice(index + 1),
    ];

    this._notify(updateType, update);
  }

  // addComment(updateType, update) {
  //   this._films = [
  //     update,
  //     ...this._films,
  //   ];

  //   this._notify(updateType, update);
  // }

  // deleteComment(updateType, update) {
  //   const index = this._films.findIndex((film) => film.id === update.id);

  //   if (index === -1) {
  //     throw new Error('Can\'t delete unexisting film');
  //   }

  //   this._films = [
  //     ...this._films.slice(0, index),
  //     ...this._films.slice(index + 1),
  //   ];

  //   this._notify(updateType);
  // }
}
