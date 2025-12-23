// Фильтрация фотографий

import { shuffleArray } from './util.js';

const RANDOM_PHOTOS_COUNT = 10;

const getRandomPhotos = (photos) => {
  const shuffled = shuffleArray(photos);
  return shuffled.slice(0, RANDOM_PHOTOS_COUNT);
};

const getDiscussedPhotos = (photos) => [...photos].sort((a, b) => b.comments.length - a.comments.length);

export { getRandomPhotos, getDiscussedPhotos };

