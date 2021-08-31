import AbstractView from './abstract';

const createFilmContainerTemplate = () => (
  `<section class="films-list">
      <h2 class="films-list__title visually-hidden">All movies. Upcoming</h2>
  </section>`
);


export default class FilmsContainter extends AbstractView {
  getTemplate() {
    return createFilmContainerTemplate();
  }
}
