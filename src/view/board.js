import AbstractView from './abstract';

const createBoardTemplate = () => (
  `<section class="films">
  </section>`
);


export default class BoardContainer extends AbstractView {
  getTemplate() {
    return createBoardTemplate();
  }
}
