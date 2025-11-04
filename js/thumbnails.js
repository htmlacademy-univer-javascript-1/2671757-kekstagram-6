import { generatedPhotos } from './photos.js';

const pictureTemplate = document.querySelector('#picture');
const picturesContainer = document.querySelector('.pictures');

export const renderThumbnails = () => {
  const fragment = document.createDocumentFragment();
  
  generatedPhotos.forEach((photo) => {
    const pictureElement = pictureTemplate.content.cloneNode(true);
    
    // Заполняем данные изображения
    const img = pictureElement.querySelector('.picture__img');
    img.src = photo.url;
    img.alt = photo.description;
    
    // Заполняем количество лайков
    const likesElement = pictureElement.querySelector('.picture__likes');
    likesElement.textContent = photo.likes;
    
    // Заполняем количество комментариев
    const commentsElement = pictureElement.querySelector('.picture__comments');
    commentsElement.textContent = photo.comments.length;
    
    fragment.appendChild(pictureElement);
  });
  
  // Вставляем все элементы в контейнер
  picturesContainer.appendChild(fragment);
};
