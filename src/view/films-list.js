import { createElement } from '../utils';

const createFilmsListTemplate = () => (
  `<div class="films-list__container">
  </div>`
);

export default class FilmsListContainer {
  constructor(){
    this._element = null;
  }

  getTemplate() {
    return createFilmsListTemplate();
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
