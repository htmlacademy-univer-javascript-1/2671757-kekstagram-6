const bigPictureElement = document.querySelector('.big-picture');
const bigPictureImg = bigPictureElement.querySelector('.big-picture__img img');
const likesCountElement = bigPictureElement.querySelector('.likes-count');
const commentsCountElement = bigPictureElement.querySelector('.comments-count');
const socialCommentsElement = bigPictureElement.querySelector('.social__comments');
const socialCaptionElement = bigPictureElement.querySelector('.social__caption');
const socialCommentCountElement = bigPictureElement.querySelector('.social__comment-count');
const commentsLoaderElement = bigPictureElement.querySelector('.comments-loader');
const cancelButton = bigPictureElement.querySelector('#picture-cancel');

const renderComments = (comments) => {
  socialCommentsElement.innerHTML = '';
  comments.forEach((comment) => {
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
    socialCommentsElement.appendChild(commentElement);
  });
};

const openBigPicture = (photo) => {
  bigPictureImg.src = photo.url;
  bigPictureImg.alt = photo.description;
  likesCountElement.textContent = photo.likes;
  commentsCountElement.textContent = photo.comments.length;
  socialCaptionElement.textContent = photo.description;
  
  renderComments(photo.comments);
  
  socialCommentCountElement.classList.add('hidden');
  commentsLoaderElement.classList.add('hidden');
  
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
document.addEventListener('keydown', onDocumentKeydown);

export { openBigPicture };

