export const isDevMode =
  process.env.NODE_ENV === 'development' ||
  process.env.NODE_ENV === 'test' ||
  process.env.API_ENVIROMENT === 'development';
