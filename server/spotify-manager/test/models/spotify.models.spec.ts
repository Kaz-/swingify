import {
  SpotifyConfiguration,
  SpotifyPaging,
  SpotifyPlaylist,
  PlaylistTrack,
  SpotifyUser,
  Track,
  SpotifyFeaturedPlaylists
} from '../../src/models/spotify.models';

export const spotifyConfiguration: SpotifyConfiguration = {
  clientId: 'testClient',
  clientSecret: 'testSecret'
}

export const authorizationHeader = {
  Authorization: 'testToken',
  'Content-Type': 'application/json'
};

export const user: SpotifyUser = {
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

export const playlists: SpotifyPaging<SpotifyPlaylist> = {
  href: 'http://an.external.url',
  items: [],
  limit: 100,
  next: null,
  offset: 0,
  previous: null,
  total: 0,
  owner: 'testOwner'
}

export const track: Track = {
  album: {
    album_type: 'album',
    artists: [
      {
        external_urls: {
          spotify: 'http://an.external.url'
        },
        href: 'http://an.external.url',
        id: '15UsOTVnJzReFVN1VCnxy4',
        name: 'XXXTENTACION',
        type: 'artist',
        uri: 'spotify:artist:15UsOTVnJzReFVN1VCnxy4'
      }
    ],
    external_urls: {
      spotify: 'http://an.external.url'
    },
    href: 'http://an.external.url',
    id: '2Ti79nwTsont5ZHfdxIzAm',
    images: [
      {
        height: 64,
        url: 'http://an.external.url',
        width: 64
      }
    ],
    name: '?',
    release_date: '2018-03-16',
    release_date_precision: 'day',
    total_tracks: 18,
    type: 'album',
    uri: 'spotify:album:2Ti79nwTsont5ZHfdxIzAm'
  },
  artists: [
    {
      external_urls: {
        spotify: 'http://an.external.url'
      },
      href: 'http://an.external.url',
      id: '15UsOTVnJzReFVN1VCnxy4',
      name: 'XXXTENTACION',
      type: 'artist',
      uri: 'spotify:artist:15UsOTVnJzReFVN1VCnxy4'
    },
    {
      external_urls: {
        spotify: 'http://an.external.url'
      },
      href: 'http://an.external.url',
      id: '2P5sC9cVZDToPxyomzF1UH',
      name: 'Joey Bada$$',
      type: 'artist',
      uri: 'spotify:artist:2P5sC9cVZDToPxyomzF1UH'
    }
  ],
  disc_number: 1,
  duration_ms: 176590,
  episode: false,
  explicit: true,
  external_ids: {
    isrc: 'USUG11800504'
  },
  external_urls: {
    spotify: 'http://an.external.url'
  },
  href: 'http://an.external.url',
  id: '7J2gyNghNTzl4EsLhXp01Q',
  is_local: false,
  name: 'infinity (888) - feat. Joey Bada$$',
  popularity: 71,
  preview_url: 'http://an.external.url',
  track: true,
  track_number: 8,
  type: 'track',
  uri: 'spotify:track:7J2gyNghNTzl4EsLhXp01Q',
  available_markets: []
}

export const playlistTrack = {
  added_at: '2020-08-22T09:49:35Z',
  added_by: user,
  is_local: false,
  track: track
}

export const tracksWithNext: SpotifyPaging<PlaylistTrack> = {
  href: 'http://an.external.url',
  items: [
    playlistTrack,
    playlistTrack
  ],
  limit: 100,
  next: 'testNext',
  offset: 0,
  previous: null,
  total: 0,
  owner: 'testOwner'
}

export const tracksWithoutNext: SpotifyPaging<PlaylistTrack> = {
  href: 'http://an.external.url',
  items: [
    playlistTrack,
    playlistTrack,
    playlistTrack
  ],
  limit: 100,
  next: null,
  offset: 0,
  previous: null,
  total: 0,
  owner: 'testOwner'
}

export const mergedTracks: SpotifyPaging<PlaylistTrack> = {
  href: 'http://an.external.url',
  items: [
    playlistTrack,
    playlistTrack,
    playlistTrack,
    playlistTrack,
    playlistTrack,
    playlistTrack,
    playlistTrack
  ],
  limit: 100,
  next: null,
  offset: 0,
  previous: null,
  total: 0,
  owner: 'testOwner'
}

export const noTracks: SpotifyPaging<PlaylistTrack> = {
  href: 'http://an.external.url',
  items: [],
  limit: 100,
  next: null,
  offset: 0,
  previous: null,
  total: 0,
  owner: 'testOwner'
}

export const playlist: SpotifyPlaylist = {
  collaborative: false,
  description: 'testDesc',
  external_urls: { spotify: 'http://an.external.url' },
  href: 'http://an.external.url',
  id: 'testId',
  images: [{ height: 50, url: 'http://an.external.url', width: 50 }],
  name: 'testName',
  owner: user,
  public: true,
  snapshot_id: 'testSnapshot',
  tracks: mergedTracks,
  type: 'testType',
  uri: 'testUri'
}

export const featuredPlaylists: SpotifyFeaturedPlaylists = {
  message: 'testMessage',
  playlists: playlists
}
