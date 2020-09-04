import { version } from '../../package.json';

export const environment = {
  production: true,
  baseUrl: 'http://localhost:4200',
  productVersion: version,
  spotify: {
    serverPath: 'http://localhost:4200/api/spotify',
    accountsPath: 'https://accounts.spotify.com',
    apiPath: 'https://api.spotify.com/v1'
  }
};
