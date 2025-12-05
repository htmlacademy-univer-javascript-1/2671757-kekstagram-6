import { sendPhoto } from './api.js';

const uploadFormElement = document.querySelector('.img-upload__form');
const uploadFileInput = uploadFormElement.querySelector('#upload-file');
const uploadOverlayElement = uploadFormElement.querySelector('.img-upload__overlay');
const uploadCancelButton = uploadFormElement.querySelector('#upload-cancel');
const uploadSubmitButton = uploadFormElement.querySelector('#upload-submit');
const hashtagsField = uploadFormElement.querySelector('.text__hashtags');
const commentField = uploadFormElement.querySelector('.text__description');
const previewImageElement = uploadFormElement.querySelector('.img-upload__preview img');
const scaleValueElement = uploadFormElement.querySelector('.scale__control--value');
const scaleSmallerButton = uploadFormElement.querySelector('.scale__control--smaller');
const scaleBiggerButton = uploadFormElement.querySelector('.scale__control--bigger');
const effectLevelContainer = uploadFormElement.querySelector('.img-upload__effect-level');
const effectLevelSliderElement = uploadFormElement.querySelector('.effect-level__slider');
const effectLevelValueElement = uploadFormElement.querySelector('.effect-level__value');
const effectsRadioButtons = uploadFormElement.querySelectorAll('.effects__radio');

const SCALE_STEP = 25;
const SCALE_MIN = 25;
const SCALE_MAX = 100;
const SCALE_DEFAULT = 100;

const MAX_COMMENT_LENGTH = 140;
const MAX_HASHTAGS_COUNT = 5;
const HASHTAG_PATTERN = /^#[a-zа-яё0-9]{1,19}$/i;

const EFFECTS = {
  none: {
    min: 0,
    max: 100,
    step: 1,
    render: () => ''
  },
  chrome: {
    min: 0,
    max: 1,
    step: 0.1,
    render: (value) => `grayscale(${value})`
  },
  sepia: {
    min: 0,
    max: 1,
    step: 0.1,
    render: (value) => `sepia(${value})`
  },
  marvin: {
    min: 0,
    max: 100,
    step: 1,
    render: (value) => `invert(${value}%)`
  },
  phobos: {
    min: 0,
    max: 3,
    step: 0.1,
    render: (value) => `blur(${value}px)`
  },
  heat: {
    min: 1,
    max: 3,
    step: 0.1,
    render: (value) => `brightness(${value})`
  }
};

let pristine;
let currentScale = SCALE_DEFAULT;
let currentEffect = 'none';
let sliderInstance = null;

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

const updateScale = (value) => {
  currentScale = value;
  scaleValueElement.value = `${value}%`;
  previewImageElement.style.transform = `scale(${value / 100})`;
};

const resetScale = () => {
  updateScale(SCALE_DEFAULT);
};

const onScaleSmallerButtonClick = () => {
  const newValue = Math.max(currentScale - SCALE_STEP, SCALE_MIN);
  updateScale(newValue);
};

const onScaleBiggerButtonClick = () => {
  const newValue = Math.min(currentScale + SCALE_STEP, SCALE_MAX);
  updateScale(newValue);
};

const applyEffect = (effectName, value) => {
  if (effectName === 'none') {
    previewImageElement.style.filter = '';
    return;
  }

  previewImageElement.style.filter = EFFECTS[effectName].render(value);
};

const setEffect = (effectName) => {
  currentEffect = effectName;

  if (effectName === 'none') {
    effectLevelContainer.classList.add('hidden');
    applyEffect('none', 0);
    return;
  }

  const effect = EFFECTS[effectName];
  effectLevelContainer.classList.remove('hidden');

  if (sliderInstance) {
    sliderInstance.updateOptions({
      range: {
        min: effect.min,
        max: effect.max
      },
      step: effect.step,
      start: effect.max
    });
  }
};

const initSlider = () => {
  if (typeof noUiSlider === 'undefined' || !effectLevelSliderElement) {
    return;
  }

  sliderInstance = noUiSlider.create(effectLevelSliderElement, {
    range: {
      min: 0,
      max: 100
    },
    start: 100,
    step: 1,
    connect: 'lower'
  });

  sliderInstance.on('update', (values) => {
    const value = parseFloat(values[0]);
    effectLevelValueElement.value = value;
    applyEffect(currentEffect, value);
  });
};

const onEffectChange = (evt) => {
  setEffect(evt.target.value);
};

const closeUploadOverlay = () => {
  uploadOverlayElement.classList.add('hidden');
  document.body.classList.remove('modal-open');
  uploadFormElement.reset();
  uploadFileInput.value = '';
  resetScale();
  setEffect('none');

  if (sliderInstance) {
    sliderInstance.set(EFFECTS.none.max);
  }

  if (pristine) {
    pristine.reset();
  }

  document.removeEventListener('keydown', onDocumentKeydown);
};

function onDocumentKeydown(evt) {
  if (evt.key === 'Escape') {
    if (isTextFieldFocused()) {
      evt.stopPropagation();
      return;
    }

    evt.preventDefault();
    closeUploadOverlay();
  }
}

const openUploadOverlay = () => {
  uploadOverlayElement.classList.remove('hidden');
  document.body.classList.add('modal-open');
  document.addEventListener('keydown', onDocumentKeydown);
  resetScale();
  setEffect('none');
  effectLevelContainer.classList.add('hidden');

  if (!sliderInstance) {
    initSlider();
  }
};

const onUploadFileChange = () => {
  openUploadOverlay();
};

const onCancelButtonClick = (evt) => {
  evt.preventDefault();
  closeUploadOverlay();
};

const showMessage = (templateId) => {
  const template = document.querySelector(`#${templateId}`);
  if (!template) {
    return;
  }

  const messageElement = template.content.querySelector(`.${templateId}`).cloneNode(true);
  const innerSelector = `.${templateId}__inner`;
  const innerElement = messageElement.querySelector(innerSelector);
  const button = messageElement.querySelector(`.${templateId}__button`);

  const closeMessage = () => {
    messageElement.remove();
    document.removeEventListener('keydown', onMessageEsc);
    messageElement.removeEventListener('click', onMessageClick);
  };

  const onMessageEsc = (evt) => {
    if (evt.key === 'Escape') {
      closeMessage();
    }
  };

  const onMessageClick = (evt) => {
    if (!innerElement.contains(evt.target)) {
      closeMessage();
    }
  };

  button.addEventListener('click', closeMessage);
  messageElement.addEventListener('click', onMessageClick);
  document.addEventListener('keydown', onMessageEsc);
  document.body.appendChild(messageElement);
};

const blockSubmitButton = () => {
  uploadSubmitButton.disabled = true;
  uploadSubmitButton.classList.add('img-upload__submit--disabled');
};

const unblockSubmitButton = () => {
  uploadSubmitButton.disabled = false;
  uploadSubmitButton.classList.remove('img-upload__submit--disabled');
};

const onFormSubmit = async (evt) => {
  evt.preventDefault();

  if (!pristine.validate()) {
    return;
  }

  blockSubmitButton();

  try {
    await sendPhoto(new FormData(uploadFormElement));
    closeUploadOverlay();
    showMessage('success');
  } catch (error) {
    showMessage('error');
  } finally {
    unblockSubmitButton();
  }
};

const initValidation = () => {
  pristine = new Pristine(uploadFormElement, {
    classTo: 'img-upload__field-wrapper',
    errorClass: 'img-upload__field-wrapper--error',
    successClass: 'img-upload__field-wrapper--success',
    errorTextParent: 'img-upload__field-wrapper',
    errorTextTag: 'div',
    errorTextClass: 'img-upload__error'
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
};

const initUploadForm = () => {
  initValidation();
  resetScale();

  uploadFileInput.addEventListener('change', onUploadFileChange);
  uploadCancelButton.addEventListener('click', onCancelButtonClick);
  uploadFormElement.addEventListener('submit', onFormSubmit);
  scaleSmallerButton.addEventListener('click', onScaleSmallerButtonClick);
  scaleBiggerButton.addEventListener('click', onScaleBiggerButtonClick);
  effectsRadioButtons.forEach((radio) => radio.addEventListener('change', onEffectChange));
};

export { initUploadForm };


