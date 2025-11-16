const bigPictureElement = document.querySelector('.big-picture');
const bigPictureImg = bigPictureElement.querySelector('.big-picture__img img');
const likesCountElement = bigPictureElement.querySelector('.likes-count');
const socialCommentsElement = bigPictureElement.querySelector('.social__comments');
const socialCaptionElement = bigPictureElement.querySelector('.social__caption');
const socialCommentCountElement = bigPictureElement.querySelector('.social__comment-count');
const commentsLoaderElement = bigPictureElement.querySelector('.comments-loader');
const cancelButton = bigPictureElement.querySelector('#picture-cancel');

const COMMENTS_PER_PAGE = 5;
let currentComments = [];
let shownCommentsCount = 0;

const createCommentElement = (comment) => {
  const commentElement = document.createElement('li');
  commentElement.className = 'social__comment';

  const imgElement = document.createElement('img');
  imgElement.className = 'social__picture';
  imgElement.src = comment.avatar;
  imgElement.alt = comment.name;
  imgElement.width = 35;
  imgElement.height = 35;

  const textElement = document.createElement('p');
  textElement.className = 'social__text';
  textElement.textContent = comment.message;

  commentElement.appendChild(imgElement);
  commentElement.appendChild(textElement);
  return commentElement;
};

const updateCommentsCounter = (totalCount) => {
  socialCommentCountElement.innerHTML = `${shownCommentsCount} из <span class="comments-count">${totalCount}</span> комментариев`;
};

const toggleLoadMoreButton = (totalCount) => {
  if (shownCommentsCount >= totalCount) {
    commentsLoaderElement.classList.add('hidden');
  } else {
    commentsLoaderElement.classList.remove('hidden');
  }
};

const renderComments = (comments, startIndex = 0) => {
  const endIndex = Math.min(startIndex + COMMENTS_PER_PAGE, comments.length);
  const commentsToShow = comments.slice(startIndex, endIndex);

  commentsToShow.forEach((comment) => {
    const commentElement = createCommentElement(comment);
    socialCommentsElement.appendChild(commentElement);
  });

  shownCommentsCount = endIndex;
  updateCommentsCounter(comments.length);
  toggleLoadMoreButton(comments.length);
};

const onLoadMoreClick = () => {
  renderComments(currentComments, shownCommentsCount);
};

const openBigPicture = (photo) => {
  bigPictureImg.src = photo.url;
  bigPictureImg.alt = photo.description;
  likesCountElement.textContent = photo.likes;
  socialCaptionElement.textContent = photo.description;

  currentComments = photo.comments;
  shownCommentsCount = 0;
  socialCommentsElement.innerHTML = '';

  socialCommentCountElement.classList.remove('hidden');
  commentsLoaderElement.classList.remove('hidden');

  renderComments(photo.comments, 0);

  bigPictureElement.classList.remove('hidden');
  document.body.classList.add('modal-open');
};

const closeBigPicture = () => {
  bigPictureElement.classList.add('hidden');
  document.body.classList.remove('modal-open');
};

const onCancelButtonClick = () => {
  closeBigPicture();
};

const onDocumentKeydown = (evt) => {
  if (evt.key === 'Escape' && !bigPictureElement.classList.contains('hidden')) {
    closeBigPicture();
  }
};

cancelButton.addEventListener('click', onCancelButtonClick);
commentsLoaderElement.addEventListener('click', onLoadMoreClick);
document.addEventListener('keydown', onDocumentKeydown);

export { openBigPicture };

