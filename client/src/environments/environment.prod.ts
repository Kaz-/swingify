import { version } from '../../package.json';

export const environment = {
  production: true,
  baseUrl: 'https://swingify.me',
  productVersion: version,
  spotify: {
    serverPath: 'https://swingify.me/api/spotify'
  }
};
