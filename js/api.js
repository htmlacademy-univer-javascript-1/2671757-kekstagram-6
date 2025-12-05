const BASE_URL = 'https://29.javascript.htmlacademy.pro/kekstagram';

const Route = {
  GET_PHOTOS: '/data',
  SEND_PHOTO: ''
};

const Method = {
  GET: 'GET',
  POST: 'POST'
};

const makeRequest = async (url, options) => {
  const response = await fetch(url, options);
  if (!response.ok) {
    throw new Error(`Ошибка запроса: ${response.status} ${response.statusText}`);
  }
  return response;
};

const getPhotos = async () => {
  const response = await makeRequest(`${BASE_URL}${Route.GET_PHOTOS}`, {
    method: Method.GET
  });
  return response.json();
};

const sendPhoto = async (formData) => makeRequest(`${BASE_URL}${Route.SEND_PHOTO}`, {
  method: Method.POST,
  body: formData
});

export { getPhotos, sendPhoto };


