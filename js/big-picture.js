import { initComments, loadMoreComments, resetComments } from './comment.js';

const bigPictureElement = document.querySelector('.big-picture');
const bigPictureImg = bigPictureElement.querySelector('.big-picture__img img');
const likesCountElement = bigPictureElement.querySelector('.likes-count');
const socialCommentsElement = bigPictureElement.querySelector('.social__comments');
const socialCaptionElement = bigPictureElement.querySelector('.social__caption');
const socialCommentCountElement = bigPictureElement.querySelector('.social__comment-count');
const socialCommentShownCountElement = bigPictureElement.querySelector('.social__comment-shown-count');
const socialCommentTotalCountElement = bigPictureElement.querySelector('.social__comment-total-count');
const commentsLoaderElement = bigPictureElement.querySelector('.comments-loader');
const cancelButton = bigPictureElement.querySelector('#picture-cancel');

let onDocumentKeydown = null;

const removeEventListeners = () => {
  if (onDocumentKeydown) {
    document.removeEventListener('keydown', onDocumentKeydown);
    onDocumentKeydown = null;
  }
};

const closeBigPicture = () => {
  bigPictureElement.classList.add('hidden');
  document.body.classList.remove('modal-open');
  resetComments();
  removeEventListeners();
};

const onCancelButtonClick = () => {
  closeBigPicture();
};

const onLoadMoreClick = () => {
  loadMoreComments();
};

const setupEventListeners = () => {
  if (onDocumentKeydown) {
    return;
  }

  onDocumentKeydown = (evt) => {
    if (evt.key === 'Escape' && !bigPictureElement.classList.contains('hidden')) {
      closeBigPicture();
    }
  };

  document.addEventListener('keydown', onDocumentKeydown);
};

const openBigPicture = (photo) => {
  bigPictureImg.src = photo.url;
  bigPictureImg.alt = photo.description;
  likesCountElement.textContent = photo.likes;
  socialCaptionElement.textContent = photo.description;

  socialCommentCountElement.classList.remove('hidden');
  commentsLoaderElement.classList.remove('hidden');

  initComments(
    photo.comments,
    socialCommentsElement,
    socialCommentShownCountElement,
    socialCommentTotalCountElement,
    commentsLoaderElement
  );

  bigPictureElement.classList.remove('hidden');
  document.body.classList.add('modal-open');
  setupEventListeners();
};

cancelButton.addEventListener('click', onCancelButtonClick);
commentsLoaderElement.addEventListener('click', onLoadMoreClick);

export { openBigPicture };
