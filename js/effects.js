// Работа с эффектами изображения

import { EFFECTS } from './effects-data.js';

let currentEffect = 'none';
let previewImageElement = null;
let effectLevelContainer = null;
let effectLevelSliderElement = null;
let effectLevelValueElement = null;
let sliderInstance = null;

const applyEffect = (effectName, value) => {
  if (!previewImageElement) {
    return;
  }

  if (effectName === 'none') {
    previewImageElement.style.filter = '';
    return;
  }

  previewImageElement.style.filter = EFFECTS[effectName].render(value);
};

const setEffect = (effectName) => {
  currentEffect = effectName;

  if (effectName === 'none') {
    if (effectLevelContainer) {
      effectLevelContainer.classList.add('hidden');
    }
    applyEffect('none', 0);
    return;
  }

  const effect = EFFECTS[effectName];
  if (effectLevelContainer) {
    effectLevelContainer.classList.remove('hidden');
  }

  if (sliderInstance) {
    sliderInstance.updateOptions({
      range: {
        min: effect.min,
        max: effect.max
      },
      step: effect.step,
      start: effect.max
    });
  } else {
    // если по какой-то причине слайдер ещё не создан
    if (effectLevelValueElement) {
      effectLevelValueElement.value = effect.max;
    }
    applyEffect(effectName, effect.max);
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
    if (effectLevelValueElement) {
      effectLevelValueElement.value = value;
    }
    applyEffect(currentEffect, value);
  });
};

const resetEffect = () => {
  setEffect('none');
  if (sliderInstance) {
    sliderInstance.set(EFFECTS.none.max);
  }
};

const initEffects = (previewImage, levelContainer, levelSlider, levelValue) => {
  previewImageElement = previewImage;
  effectLevelContainer = levelContainer;
  effectLevelSliderElement = levelSlider;
  effectLevelValueElement = levelValue;
  resetEffect();
};

const getCurrentEffect = () => currentEffect;

export {
  initEffects,
  initSlider,
  setEffect,
  resetEffect,
  getCurrentEffect
};

