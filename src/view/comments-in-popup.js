import { generateComment } from '../mock/comments';
import SmartView from './smart';
import { isEnter } from '../utils/common.js';
import dayjs from 'dayjs';
import { BLANK_COMMENT } from '../const';


const createCommentTemplate = (comments) => {

  const popupCommentsTemplate = [];

  if(comments.length > 0) {
    comments.forEach((comment)=> {
      popupCommentsTemplate.push(`<li class="film-details__comment">
          <span class="film-details__comment-emoji">
            <img src="${comment.emoji}" width="55" height="55" alt="">
          </span>
          <div>
            <p class="film-details__comment-text">${comment.text}</p>
            <p class="film-details__comment-info">
              <span class="film-details__comment-author">${comment.author}</span>
              <span class="film-details__comment-day">${comment.date}</span>
              <button class="film-details__comment-delete" data-id="${comment.id}">Delete</button>
            </p>
          </div>
        </li>`);
    });
  } else {popupCommentsTemplate.push('');}

  return    `<section class="film-details__comments-wrap">
        <h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">${comments.length}</span></h3>

        <ul class="film-details__comments-list">
          ${popupCommentsTemplate.join('')}
        </ul>
        <div class="film-details__new-comment">
        <div class="film-details__add-emoji-label">
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
  constructor(commentsIds, newComment = BLANK_COMMENT){
    super();
    this._commentsIds = commentsIds;
    this._comments = new Array(commentsIds.length).fill().map(generateComment);
    this._newComment = newComment;

    this._commentDeleteHandler = this._commentDeleteHandler.bind(this);
    this._commentTextInputHandler = this._commentTextInputHandler.bind(this);
    this._commentSubmitHandler = this._commentSubmitHandler.bind(this);
    this._emojiClickHandler = this._emojiClickHandler.bind(this);

    this._setInnerHandlers();
  }

  getTemplate() {
    if (this._newComment !== BLANK_COMMENT) {
      this._comments.push(this._newComment);
    }

    return createCommentTemplate(this._comments);
  }

  restoreHandlers() {
    this._setInnerHandlers();
  }

  _setInnerHandlers() {
    this.getElement()
      .querySelector('.film-details__emoji-list_form')
      .addEventListener('change', this._emojiClickHandler);
    this.getElement()
      .querySelector('.film-details__comment-input')
      .addEventListener('input', this._commentTextInputHandler);
  }

  setCommentDeleteHandler (callback) {
    this._callback.commentDelete = callback;
    if(this._commentsIds.length > 0){
      this.getElement()
        .querySelectorAll('.film-details__comment-delete')
        .forEach( (deleteButtonsElement) => deleteButtonsElement.addEventListener('click', this._commentDeleteHandler));
    }
  }

  setCommentSubmitHandler (callback) {
    this._callback.commentSubmit = callback;
    this.getElement().addEventListener('keydown', this._commentSubmitHandler);
  }

  _commentSubmitHandler(evt) {
    if (isEnter(evt) && evt.ctrlKey) {
      this._callback.commentSubmit({
        date: dayjs().format('YYYY/MM/DD HH:MM'),
        text: document.querySelector('.film-details__comment-input').value,
        emoji: this.getElement().querySelector('.film-details__add-emoji-label > img').src,
      });
    }
  }

  _commentDeleteHandler(evt) {
    evt.preventDefault();
    const commentToDeleteId = evt.target.dataset.id;
    this._callback.commentDelete(commentToDeleteId);
  }

  _emojiClickHandler(evt) {
    evt.preventDefault();
    const emoji= evt.target.value;
    this.getElement().querySelector('.film-details__add-emoji-label').innerHTML = `<img src="images/emoji/${emoji}.png" width="55" height="55" alt="emoji-${emoji}"></img>`;
  }

  _commentTextInputHandler(evt) {
    evt.preventDefault();
  }
}
