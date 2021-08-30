import AbstractView from './abstract';

const createShowMoreButtonTemplate = () => (
  '<button class="films-list__show-more">Show more</button>'
);

export default class showMoreButton extends AbstractView {
  constructor() {
    super();

    this._clickHandler = this._clickHandler.bind(this);
  }

  getTemplate() {
    return createShowMoreButtonTemplate();
  }

  _clickHandler(evt) {
    evt.preventDefault();
    // this._callback.click();
    this._callback_click();
  }

  setClickHandler(callback) {
    // this._callback.click = callback;
    this._callback_click = callback;
    this.getElement().addEventListener('click', this._clickHandler);
  }
}
