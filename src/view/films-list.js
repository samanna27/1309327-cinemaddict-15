import AbstractView from './abstract';

const createFilmsListTemplate = () => (
  `<div class="films-list__container">
  </div>`
);

export default class FilmsListContainer extends AbstractView {
  getTemplate() {
    return createFilmsListTemplate();
  }
}
