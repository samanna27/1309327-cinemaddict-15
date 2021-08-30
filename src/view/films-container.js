import { createElement } from '../utils';

const createFilmContainerTemplate = () => (
  `<section class="films">
  <section class="films-list">
      <h2 class="films-list__title visually-hidden">All movies. Upcoming</h2>
  </section>
  </section>`
);


export default class FilmsContainter {
  constructor() {
    this._element = null;
  }

  getTemplate() {
    return createFilmContainerTemplate();
  }

  getElement() {
    if(!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  removeElement(){
    this._element = null;
  }
}
