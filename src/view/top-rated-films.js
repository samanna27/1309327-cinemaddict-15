import AbstractView from './abstract';

const createTopFilmsTemplate = () => (
  `<section class="films-list films-list--extra">
      <h2 class="films-list__title">Top rated</h2>

    </section>`
);

export default class TopFilms extends AbstractView {
  getTemplate() {
    return createTopFilmsTemplate();
  }
}
