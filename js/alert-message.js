// Показ сообщений (success/error)

const showMessage = (templateId) => {
  const template = document.querySelector(`#${templateId}`);
  if (!template) {
    return;
  }

  const messageElement = template.content.querySelector(`.${templateId}`).cloneNode(true);
  const innerSelector = `.${templateId}__inner`;
  const innerElement = messageElement.querySelector(innerSelector);
  const button = messageElement.querySelector(`.${templateId}__button`);

  const onMessageEsc = (evt) => {
    if (evt.key === 'Escape') {
      evt.preventDefault();
      evt.stopImmediatePropagation();
      closeMessage();
    }
  };

  const onMessageClick = (evt) => {
    if (!innerElement.contains(evt.target)) {
      closeMessage();
    }
  };

  function closeMessage() {
    messageElement.remove();
    document.removeEventListener('keydown', onMessageEsc, true);
    messageElement.removeEventListener('click', onMessageClick);
  }

  button.addEventListener('click', closeMessage);
  messageElement.addEventListener('click', onMessageClick);
  document.addEventListener('keydown', onMessageEsc, true); // Use capture phase
  document.body.appendChild(messageElement);
};

const ERROR_BANNER_TOP = 20;
const ERROR_BANNER_LEFT_PERCENT = 50;
const ERROR_BANNER_PADDING_VERTICAL = 15;
const ERROR_BANNER_PADDING_HORIZONTAL = 25;
const ERROR_BANNER_FONT_WEIGHT = 700;
const ERROR_BANNER_BORDER_RADIUS = 6;
const ERROR_BANNER_Z_INDEX = 9999;
const ERROR_BANNER_TIMEOUT = 5000;

const showErrorBanner = (message) => {

  // Удаляем существующее сообщение об ошибке, если есть
  const existingError = document.querySelector('.data-error');
  if (existingError) {
    existingError.remove();
  }

  const errorElement = document.createElement('div');
  errorElement.className = 'data-error';
  errorElement.textContent = message;
  errorElement.style.cssText = `
    position: fixed;
    top: ${ERROR_BANNER_TOP}px;
    left: ${ERROR_BANNER_LEFT_PERCENT}%;
    transform: translateX(-50%);
    padding: ${ERROR_BANNER_PADDING_VERTICAL}px ${ERROR_BANNER_PADDING_HORIZONTAL}px;
    background: #ff4e4e;
    color: #ffffff;
    font-weight: ${ERROR_BANNER_FONT_WEIGHT};
    border-radius: ${ERROR_BANNER_BORDER_RADIUS}px;
    z-index: ${ERROR_BANNER_Z_INDEX};
  `;
  document.body.appendChild(errorElement);
  setTimeout(() => errorElement.remove(), ERROR_BANNER_TIMEOUT);
};

export { showMessage, showErrorBanner };

