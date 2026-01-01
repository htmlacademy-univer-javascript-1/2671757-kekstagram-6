// Загрузка файла и показ превью

let previewImageElement = null;
let effectsPreviews = null;

const updatePreviewImage = (file) => {
  if (!file || !file.type.startsWith('image/')) {
    return;
  }

  if (!previewImageElement) {
    return;
  }

  // Clean up previous blob URL if exists
  if (previewImageElement.src && previewImageElement.src.startsWith('blob:')) {
    URL.revokeObjectURL(previewImageElement.src);
  }

  const blobUrl = URL.createObjectURL(file);
  previewImageElement.src = blobUrl;

  if (effectsPreviews) {
    effectsPreviews.forEach((preview) => {
      preview.style.backgroundImage = `url(${blobUrl})`;
    });
  }
};

const resetPreviewImage = () => {
  if (!previewImageElement) {
    return;
  }

  // Clean up blob URL if exists
  if (previewImageElement.src && previewImageElement.src.startsWith('blob:')) {
    URL.revokeObjectURL(previewImageElement.src);
  }
  previewImageElement.src = 'img/upload-default-image.jpg';

  if (effectsPreviews) {
    effectsPreviews.forEach((preview) => {
      preview.style.backgroundImage = '';
    });
  }
};

const initLoader = (previewImage, effectsPreviewElements) => {
  previewImageElement = previewImage;
  effectsPreviews = effectsPreviewElements;
};

export { initLoader, updatePreviewImage, resetPreviewImage };

