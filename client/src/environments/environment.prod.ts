import { version } from '../../package.json';

export const environment = {
  production: true,
  baseUrl: 'https://swingify.me',
  productVersion: version,
  spotify: {
    userPath: 'https://swingify.me/api/spotify/user',
    playlistsPath: 'https://swingify.me/api/spotify/playlists',
    libraryPath: 'https://swingify.me/api/spotify/library',
    browsePath: 'https://swingify.me/api/spotify/browse'
  },
  youtube: {
    userPath: 'https://swingify.me/api/youtube/user',
  }
};
