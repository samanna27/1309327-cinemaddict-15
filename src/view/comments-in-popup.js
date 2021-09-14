import { generateComment } from '../mock/comments';
import SmartView from './smart';
import { BLANK_COMMENT } from '../const';

const createCommentTemplate = (data) => {
  const { comments, isEmoji, popupCommentsTemplate } = data;
  const commentsArray = new Array(comments.length).fill().map(generateComment);

  if(data.isComment) {
    commentsArray.forEach((element)=> popupCommentsTemplate.push(`<li class="film-details__comment">
          <span class="film-details__comment-emoji">
            <img src="./images/emoji/${element.emoji}.png" width="55" height="55" alt="">
          </span>
          <div>
            <p class="film-details__comment-text">${element.text}</p>
            <p class="film-details__comment-info">
              <span class="film-details__comment-author">${element.author}</span>
              <span class="film-details__comment-day">${element.date}</span>
              <button class="film-details__comment-delete" data-id="${element.id}">Delete</button>
            </p>
          </div>
        </li>`));
  } else {popupCommentsTemplate.push('');}

  return    `<section class="film-details__comments-wrap">
        <h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">${comments.length}</span></h3>

        <ul class="film-details__comments-list">
          ${popupCommentsTemplate}
        </ul>
        <div class="film-details__new-comment">
          <div class="film-details__add-emoji-label">
          ${isEmoji !== ''? `<img src="./images/emoji/${isEmoji}.png" width="55" height="55" alt="emoji-${isEmoji}">`: '<img src="" width="55" height="55" alt=""></img>'}
          </div>

          <label class="film-details__comment-label">
          <textarea class="film-details__comment-input" placeholder="Select reaction below and write comment here" name="comment"></textarea>
          </label>

          <div class="film-details__emoji-list">
            <form class="film-details__emoji-list_form">
              <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-smile" value="smile">
              <label class="film-details__emoji-label" for="emoji-smile">
              <img src="./images/emoji/smile.png" width="30" height="30" alt="emoji">
              </label>

              <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-sleeping" value="sleeping">
              <label class="film-details__emoji-label" for="emoji-sleeping">
              <img src="./images/emoji/sleeping.png" width="30" height="30" alt="emoji">
              </label>

              <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-puke" value="puke">
              <label class="film-details__emoji-label" for="emoji-puke">
              <img src="./images/emoji/puke.png" width="30" height="30" alt="emoji">
              </label>

              <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-angry" value="angry">
              <label class="film-details__emoji-label" for="emoji-angry">
              <img src="./images/emoji/angry.png" width="30" height="30" alt="emoji">
              </label>
            </form>
          </div>
        </div>

      </section>`;
};

export default class CommentInPopup extends SmartView{
  constructor(comment = BLANK_COMMENT){
    super();
    this._data = CommentInPopup.parseCommentToData(comment);

    this._commentDeleteHandler = this._commentDeleteHandler.bind(this);
    this._commentTextInputHandler = this._commentTextInputHandler.bind(this);
    this._emojiClickHandler = this._emojiClickHandler.bind(this);

    this._setInnerHandlers(this._data);
  }

  reset(comment) {
    this.updateData(
      CommentInPopup.parseCommentToData(comment),
    );
  }

  getTemplate() {
    return createCommentTemplate(this._data);
  }

  restoreHandlers() {
    this._setInnerHandlers(this._data);
    // this.setFormSubmitHandler(this._callback.formSubmit);
  }

  _setInnerHandlers(data) {
    if(data.comments.length !== 0){
      this.getElement()
        .querySelector('.film-details__comment-delete')
        .addEventListener('click', this._commentDeleteHandler);
    }
    this.getElement()
      .querySelector('.film-details__emoji-list_form')
      .addEventListener('change', this._emojiClickHandler);
    this.getElement()
      .querySelector('.film-details__comment-input')
      .addEventListener('input', this._commentTextInputHandler);
  }

  _commentDeleteHandler(evt) {
    evt.preventDefault();
    const modifiedCommentsList = this._data.popupCommentsTemplate.slice();
    console.log(this._data);
    modifiedCommentsList.forEach((element) => {
      console.log(element);
      if(element.id === evt.target.dataset.id) {
        console.log(element.id === evt.target.dataset.id);
        modifiedCommentsList.splice(0,this._data.comments.indexOf(element.id));
        return modifiedCommentsList;
      }
    });
    // const removed = this._data.comments.splice(0,this._data.comments.indexOf(evt.target.dataset.id));
    this.updateData({
      comments: this._data.popupCommentsTemplate,
    });
  }

  _emojiClickHandler(evt) {
    evt.preventDefault();
    this._data.isEmoji= evt.target.value;
    this.updateData({
      isEmoji: evt.target.value,
    });
  }

  _commentTextInputHandler(evt) {
    evt.preventDefault();
    this.updateData({
      text: evt.target.value,
    }, true);
  }

  static parseCommentToData(comment) {

    return Object.assign(
      {},
      comment,
      {
        isComment: comment.comments.length!==0,
        isEmoji: '',
        popupCommentsTemplate: [],
      },
    );
  }

  static parseDataToComment(data) {
    data = Object.assign({}, data);

    if (!data.isComment) {
      data.isComment = null;
    }

    if (!data.isEmoji) {
      data.isEmoji = null;
    }

    delete data.isComment;
    delete data.isEmoji;

    return data;
  }
}
