// Работа с комментариями в big-picture

const COMMENTS_PER_PAGE = 5;
let currentComments = [];
let shownCommentsCount = 0;
let socialCommentsElement = null;
let socialCommentShownCountElement = null;
let socialCommentTotalCountElement = null;
let commentsLoaderElement = null;

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
  if (socialCommentShownCountElement) {
    socialCommentShownCountElement.textContent = shownCommentsCount;
  }
  if (socialCommentTotalCountElement) {
    socialCommentTotalCountElement.textContent = totalCount;
  }
};

const toggleLoadMoreButton = (totalCount) => {
  if (!commentsLoaderElement) {
    return;
  }

  if (shownCommentsCount >= totalCount) {
    commentsLoaderElement.classList.add('hidden');
    return;
  }
  commentsLoaderElement.classList.remove('hidden');
};

const renderComments = (comments, startIndex = 0) => {
  if (!socialCommentsElement) {
    return;
  }

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

const loadMoreComments = () => {
  renderComments(currentComments, shownCommentsCount);
};

const initComments = (comments, commentsContainer, shownCount, totalCount, loader) => {
  currentComments = comments;
  shownCommentsCount = 0;
  socialCommentsElement = commentsContainer;
  socialCommentShownCountElement = shownCount;
  socialCommentTotalCountElement = totalCount;
  commentsLoaderElement = loader;

  if (socialCommentsElement) {
    while (socialCommentsElement.firstChild) {
      socialCommentsElement.removeChild(socialCommentsElement.firstChild);
    }
  }

  renderComments(comments, 0);
};

const resetComments = () => {
  currentComments = [];
  shownCommentsCount = 0;
};

export { initComments, loadMoreComments, resetComments };

