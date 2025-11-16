export const getRandomInteger = (a, b) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));
  return Math.floor(lower + Math.random() * (upper - lower + 1));
};

export const getRandomArrayElements = (elements) =>
  elements[getRandomInteger(0, elements.length - 1)];

let lastId = 0;
export const generateUniqueId = () => ++lastId;
