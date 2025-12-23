// Данные эффектов для изображений

export const EFFECTS = {
  none: {
    min: 0,
    max: 100,
    step: 1,
    render: () => ''
  },
  chrome: {
    min: 0,
    max: 1,
    step: 0.1,
    render: (value) => `grayscale(${value})`
  },
  sepia: {
    min: 0,
    max: 1,
    step: 0.1,
    render: (value) => `sepia(${value})`
  },
  marvin: {
    min: 0,
    max: 100,
    step: 1,
    render: (value) => `invert(${value}%)`
  },
  phobos: {
    min: 0,
    max: 3,
    step: 0.1,
    render: (value) => `blur(${value}px)`
  },
  heat: {
    min: 1,
    max: 3,
    step: 0.1,
    render: (value) => `brightness(${value})`
  }
};

