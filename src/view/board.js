import AbstractView from './abstract';

const createBoardTemplate = () => (
  `<section class="films">
  </section>`
);


export default class BoardContainter extends AbstractView {
  getTemplate() {
    return createBoardTemplate();
  }
}
