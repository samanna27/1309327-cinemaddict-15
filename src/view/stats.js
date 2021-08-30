import AbstractView from './abstract';

const createStatsTemplate = (films) => (
  `<p>${films.length} movies inside</p>`
);

export default class Stats extends AbstractView {
  constructor(films) {
    super();
    this._films = films;
  }

  getTemplate() {
    return createStatsTemplate(this._films);
  }
}
