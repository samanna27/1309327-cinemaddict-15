import { createElement } from '../utils';

const createStatsTemplate = (films) => (
  `<p>${films.length} movies inside</p>`
);

export default class Stats {
  constructor(films) {
    this._films = films;
    this._element = null;
  }

  getTemplate() {
    return createStatsTemplate(this._films);
  }

  getElement() {
    if(!this._element){
      this._element = createElement(this.getTemplate());
    }
    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}
