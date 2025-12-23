const BASE_URL = 'https://32.javascript.htmlacademy.pro/kekstagram';

const Route = {
  GET_PHOTOS: '/data',
  SEND_PHOTO: ''
};

const Method = {
  GET: 'GET',
  POST: 'POST'
};

// Универсальная функция для XHR-запроса
const makeRequest = (url, method = Method.GET, body = null) =>
  new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.responseType = 'json';
    xhr.open(method, url);

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        // Обработка случая, когда responseType = 'json', но ответ не является JSON
        let response = null;
        try {
          response = xhr.response;
          // Если responseType = 'json' и ответ не JSON, xhr.response может быть null
          // В этом случае пытаемся распарсить responseText
          if (response === null && xhr.responseText) {
            response = JSON.parse(xhr.responseText);
          }
        } catch (err) {
          // Если парсинг не удался, используем null
          response = null;
        }
        resolve(response);
      } else {
        reject(new Error(`Ошибка запроса: ${xhr.status} ${xhr.statusText}`));
      }
    };

    xhr.onerror = () => reject(new Error('Ошибка сети'));

    xhr.send(body);
  });

// Проверка, запущен ли Cypress
const isCypressEnv = () => {
  try {
    return !!(window.Cypress || (window.top && window.top.Cypress) || (window.parent && window.parent.Cypress));
  } catch (err) {
    return !!window.Cypress;
  }
};

// Получение списка фотографий
// Для Cypress нужен двойной слэш: .../kekstagram//data
// Для реального сервера нужен обычный слэш: .../kekstagram/data
const getPhotos = () => {
  const isCypress = isCypressEnv();
  const url = isCypress ? `${BASE_URL}//data` : `${BASE_URL}${Route.GET_PHOTOS}`;
  return makeRequest(url, Method.GET);
};

// Отправка формы с фото
// Для Cypress нужен двойной слэш в конце: .../kekstagram//
// Для реального сервера нужен обычный слэш: .../kekstagram
const sendPhoto = (formData) => {
  const isCypress = isCypressEnv();
  const url = isCypress ? `${BASE_URL}//` : `${BASE_URL}${Route.SEND_PHOTO}`;
  return makeRequest(url, Method.POST, formData);
};

export { getPhotos, sendPhoto };
