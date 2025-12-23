// Масштабирование изображения

const SCALE_STEP = 25;
const SCALE_MIN = 25;
const SCALE_MAX = 100;
const SCALE_DEFAULT = 100;

let currentScale = SCALE_DEFAULT;
let scaleValueElement = null;
let previewImageElement = null;

const updateScale = (value) => {
  currentScale = value;
  if (scaleValueElement) {
    scaleValueElement.value = `${value}%`;
  }
  if (previewImageElement) {
    previewImageElement.style.transform = `scale(${value / 100})`;
  }
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

const getCurrentScale = () => currentScale;

const initScale = (scaleValue, previewImage) => {
  scaleValueElement = scaleValue;
  previewImageElement = previewImage;
  resetScale();
};

export {
  initScale,
  resetScale,
  onScaleSmallerButtonClick,
  onScaleBiggerButtonClick,
  getCurrentScale
};

