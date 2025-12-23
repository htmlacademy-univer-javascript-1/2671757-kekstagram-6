// Валидация формы загрузки

const MAX_COMMENT_LENGTH = 140;
const MAX_HASHTAGS_COUNT = 5;
const HASHTAG_PATTERN = /^#[a-zа-яё0-9]{1,19}$/i;

let pristine = null;
let hashtagsField = null;
let commentField = null;

const getHashtagsArray = (value) => value
  .trim()
  .split(/\s+/)
  .filter((tag) => tag.length > 0);

const validateHashtagFormat = (value) => {
  if (!value.trim()) {
    return true;
  }

  return getHashtagsArray(value).every((tag) => HASHTAG_PATTERN.test(tag));
};

const validateHashtagCount = (value) => {
  if (!value.trim()) {
    return true;
  }

  return getHashtagsArray(value).length <= MAX_HASHTAGS_COUNT;
};

const validateHashtagUniqueness = (value) => {
  if (!value.trim()) {
    return true;
  }

  const hashtags = getHashtagsArray(value).map((tag) => tag.toLowerCase());
  return hashtags.length === new Set(hashtags).size;
};

const validateCommentLength = (value) => value.length <= MAX_COMMENT_LENGTH;

const isTextFieldFocused = () =>
  document.activeElement === hashtagsField || document.activeElement === commentField;

const initValidation = (formElement, hashtags, comment) => {
  hashtagsField = hashtags;
  commentField = comment;

  pristine = new Pristine(formElement, {
    classTo: 'img-upload__field-wrapper',
    errorClass: 'img-upload__field-wrapper--error',
    successClass: 'img-upload__field-wrapper--success',
    errorTextParent: 'img-upload__field-wrapper',
    errorTextTag: 'div',
    // Cypress tests expect Pristine error nodes to have `.pristine-error` class.
    // Keep existing project styling hook as well.
    errorTextClass: 'pristine-error img-upload__error'
  });

  pristine.addValidator(
    hashtagsField,
    validateHashtagFormat,
    'Хэш-тег должен начинаться с символа #, содержать только буквы и цифры и быть не длиннее 20 символов',
    3,
    false
  );

  pristine.addValidator(
    hashtagsField,
    validateHashtagCount,
    `Нельзя указать больше ${MAX_HASHTAGS_COUNT} хэш-тегов`,
    2,
    false
  );

  pristine.addValidator(
    hashtagsField,
    validateHashtagUniqueness,
    'Хэш-теги не должны повторяться',
    1,
    false
  );

  pristine.addValidator(
    commentField,
    validateCommentLength,
    `Комментарий не длиннее ${MAX_COMMENT_LENGTH} символов`
  );

  // Validate fields on input to automatically clear errors
  hashtagsField.addEventListener('input', () => {
    pristine.validate(hashtagsField);
  });
  commentField.addEventListener('input', () => {
    pristine.validate(commentField);
  });
};

const validate = () => pristine ? pristine.validate() : false;

const reset = () => {
  if (pristine) {
    pristine.reset();
  }
};

const clearErrors = (formElement) => {
  if (!pristine) {
    return;
  }

  pristine.reset();
  // Manually remove error elements from DOM
  const errorElements = formElement.querySelectorAll('.pristine-error, .img-upload__error');
  errorElements.forEach((error) => error.remove());
  // Also remove error classes from fields
  const fieldWrappers = formElement.querySelectorAll('.img-upload__field-wrapper');
  fieldWrappers.forEach((wrapper) => {
    if (wrapper.classList.contains('img-upload__field-wrapper--error')) {
      wrapper.classList.remove('img-upload__field-wrapper--error');
    }
    if (wrapper.classList.contains('img-upload__field-wrapper--success')) {
      wrapper.classList.remove('img-upload__field-wrapper--success');
    }
  });
};

export { initValidation, validate, reset, clearErrors, isTextFieldFocused };

