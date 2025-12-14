import { openBigPicture } from './big-picture.js';
import { initUploadForm } from './upload-form.js';
import { getPhotos } from './api.js';

const RANDOM_PHOTOS_COUNT = 10;
const DEBOUNCE_DELAY = 500;

const picturesContainer = document.querySelector('.pictures');
const pictureTemplate = document.querySelector('#picture').content.querySelector('.picture');
const filtersSection = document.querySelector('.img-filters');
const filterButtons = document.querySelectorAll('.img-filters__button');
const filterDefaultButton = document.querySelector('#filter-default');
const filterRandomButton = document.querySelector('#filter-random');
const filterDiscussedButton = document.querySelector('#filter-discussed');

let photosData = [];

const clearThumbnails = () => {
  picturesContainer.querySelectorAll('.picture').forEach((picture) => picture.remove());
};

const renderThumbnail = (photo) => {
  const pictureElement = pictureTemplate.cloneNode(true);
  const pictureImg = pictureElement.querySelector('.picture__img');
  const pictureComments = pictureElement.querySelector('.picture__comments');
  const pictureLikes = pictureElement.querySelector('.picture__likes');

  pictureImg.src = photo.url;
  pictureImg.alt = photo.description;
  pictureComments.textContent = photo.comments.length;
  pictureLikes.textContent = photo.likes;

  pictureElement.addEventListener('click', (evt) => {
    evt.preventDefault();
    openBigPicture(photo);
  });

  return pictureElement;
};

const renderThumbnails = (photos) => {
  clearThumbnails();
  const fragment = document.createDocumentFragment();
  photos.forEach((photo) => fragment.appendChild(renderThumbnail(photo)));
  picturesContainer.appendChild(fragment);
};

const shuffleArray = (array) => {
  const copy = [...array];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
};

const getRandomPhotos = (photos) => {
  const shuffled = shuffleArray(photos);
  return shuffled.slice(0, RANDOM_PHOTOS_COUNT);
};

const getDiscussedPhotos = (photos) => [...photos].sort((a, b) => b.comments.length - a.comments.length);

const setActiveFilterButton = (activeButton) => {
  filterButtons.forEach((button) => button.classList.remove('img-filters__button--active'));
  activeButton.classList.add('img-filters__button--active');
};

const debounce = (callback, delay = DEBOUNCE_DELAY) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => callback.apply(null, args), delay);
  };
};

const updateGallery = (photos) => {
  renderThumbnails(photos);
};

const debouncedUpdateGallery = debounce(updateGallery);

const onFilterDefaultClick = () => {
  setActiveFilterButton(filterDefaultButton);
  debouncedUpdateGallery(photosData);
};

const onFilterRandomClick = () => {
  setActiveFilterButton(filterRandomButton);
  debouncedUpdateGallery(getRandomPhotos(photosData));
};

const onFilterDiscussedClick = () => {
  setActiveFilterButton(filterDiscussedButton);
  debouncedUpdateGallery(getDiscussedPhotos(photosData));
};

const showErrorBanner = (message) => {
  const errorElement = document.createElement('div');
  errorElement.textContent = message;
  errorElement.style.cssText = `
    position: fixed;
    top: 20px;
    left: 50%;
    transform: translateX(-50%);
    padding: 15px 25px;
    background: #ff4e4e;
    color: #ffffff;
    font-weight: 700;
    border-radius: 6px;
    z-index: 9999;
  `;
  document.body.appendChild(errorElement);
  setTimeout(() => errorElement.remove(), 5000);
};

const loadPhotos = async () => {
  try {
    photosData = await getPhotos();
    updateGallery(photosData);
    filtersSection.classList.remove('img-filters--inactive');

    filterDefaultButton.addEventListener('click', onFilterDefaultClick);
    filterRandomButton.addEventListener('click', onFilterRandomClick);
    filterDiscussedButton.addEventListener('click', onFilterDiscussedClick);
  } catch (error) {
    showErrorBanner('Ошибка загрузки данных. Попробуйте обновить страницу.');
  }
};

initUploadForm();
loadPhotos();
