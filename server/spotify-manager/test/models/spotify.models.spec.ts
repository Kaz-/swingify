import { SpotifyConfiguration, SpotifyPaging, SpotifyPlaylist, PlaylistTrack, SpotifyUser } from "../../src/models/spotify.models";

export const spotifyConfiguration: SpotifyConfiguration = {
  clientId: 'testClient',
  clientSecret: 'testSecret'
}

export const authorizationHeader = {
  Authorization: 'testToken',
  'Content-Type': 'application/json'
};

export const spotifyUser: SpotifyUser = {
  country: 'testCountry',
  display_name: 'testDisplayName',
  email: 'test@email.com',
  external_urls: { spotify: 'http://an.external.url' },
  followers: { href: 'http://an.external.url', total: 30 },
  href: 'http://an.external.url',
  id: 'testId',
  images: [{ height: 50, url: 'http://an.external.url', width: 50 }],
  type: 'testType',
  uri: 'testUri'
}

export const spotifyPlaylists: SpotifyPaging<SpotifyPlaylist> = {
  href: 'http://an.external.url',
  items: [],
  limit: 100,
  next: null,
  offset: 0,
  previous: null,
  total: 0,
  owner: 'testOwner'
}

export const spotifyTracks: SpotifyPaging<PlaylistTrack> = {
  href: 'http://an.external.url',
  items: [],
  limit: 100,
  next: null,
  offset: 0,
  previous: null,
  total: 0,
  owner: 'testOwner'
}
