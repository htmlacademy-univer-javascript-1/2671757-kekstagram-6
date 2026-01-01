import { sendPhoto } from './api.js';
import { initScale, resetScale, onScaleSmallerButtonClick, onScaleBiggerButtonClick } from './scale_picture.js';
import { initEffects, initSlider, setEffect, resetEffect } from './effects.js';
import { initLoader, updatePreviewImage, resetPreviewImage } from './loaderForm.js';
import { initValidation, validate, clearErrors, isTextFieldFocused } from './user-form-validate.js';
import { showMessage } from './alert-message.js';

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
const effectsPreviews = uploadFormElement.querySelectorAll('.effects__preview');

const closeUploadOverlay = () => {
  uploadOverlayElement.classList.add('hidden');
  document.body.classList.remove('modal-open');
  uploadFormElement.reset();
  uploadFileInput.value = '';
  resetScale();
  resetEffect();

  resetPreviewImage();
  clearErrors(uploadFormElement);

  document.removeEventListener('keydown', onDocumentKeydown);
};

const onDocumentKeydown = (evt) => {
  if (evt.key === 'Escape') {
    if (isTextFieldFocused()) {
      evt.stopPropagation();
      return;
    }

    evt.preventDefault();
    closeUploadOverlay();
  }
};

const openUploadOverlay = () => {
  uploadOverlayElement.classList.remove('hidden');
  document.body.classList.add('modal-open');
  document.addEventListener('keydown', onDocumentKeydown);

  resetScale();
  resetEffect();
  effectLevelContainer.classList.add('hidden');

  if (effectLevelSliderElement && typeof noUiSlider !== 'undefined') {
    initSlider();
  }

  clearErrors(uploadFormElement);
};

const onUploadFileChange = (evt) => {
  const file = evt.target.files[0];
  if (file) {
    updatePreviewImage(file);
    openUploadOverlay();
  }
};

const onCancelButtonClick = (evt) => {
  evt.preventDefault();
  closeUploadOverlay();
};

const onEffectChange = (evt) => {
  evt.preventDefault();
  setEffect(evt.target.value);
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

  if (!validate()) {
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

const initUploadForm = () => {
  initValidation(uploadFormElement, hashtagsField, commentField);
  initScale(scaleValueElement, previewImageElement);
  initEffects(previewImageElement, effectLevelContainer, effectLevelSliderElement, effectLevelValueElement);
  initLoader(previewImageElement, effectsPreviews);
  resetScale();

  // Initialize slider if noUiSlider is available
  if (effectLevelSliderElement && typeof noUiSlider !== 'undefined') {
    initSlider();
  }

  uploadFileInput.addEventListener('change', onUploadFileChange);
  uploadCancelButton.addEventListener('click', onCancelButtonClick);
  uploadFormElement.addEventListener('submit', onFormSubmit);
  scaleSmallerButton.addEventListener('click', onScaleSmallerButtonClick);
  scaleBiggerButton.addEventListener('click', onScaleBiggerButtonClick);
  effectsRadioButtons.forEach((radio) => radio.addEventListener('change', onEffectChange));
};

export { initUploadForm };
