export interface SpotifyConfiguration {
  readonly clientId: string;
  readonly clientSecret: string;
}

export interface AuthorizeQueryOptions {
  clientId: string;
  responseType: string;
  redirectUri: string;
  scope?: string;
  state?: string;
  showDialog?: boolean;
}

export interface AuthorizationToken {
  readonly access_token: string;
  readonly expires_in: number;
  readonly refresh_token: string;
  readonly scope: string;
  readonly token_type: string;
}

export interface SpotifyUser {
  readonly country?: string;
  readonly display_name: string;
  readonly email?: string;
  readonly external_urls: ExternalUrl;
  readonly followers: Followers;
  readonly href: string;
  readonly id: string;
  readonly images: Image[];
  readonly product?: string;
  readonly type: string;
  readonly uri: string;
}

export interface SpotifyPlaylist {
  collaborative: boolean;
  description: string;
  external_urls: ExternalUrl;
  href: string;
  readonly id: string;
  images: Image[];
  name: string;
  readonly owner: SpotifyUser;
  public: boolean;
  snapshot_id: string;
  tracks: Track[];
  readonly type: string;
  uri: string;
}

export interface ExternalUrl {
  readonly key: string;
  readonly value: string;
}

export interface Followers {
  readonly href: string;
  readonly total: number;
}

export interface Image {
  readonly height: number;
  readonly url: string;
  readonly width: number;
}

export interface Track {
  readonly href: string;
  readonly total: number;
}
