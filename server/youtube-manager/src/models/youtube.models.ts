export const SCOPES = 'https://www.googleapis.com/auth/youtube';

export interface YoutubeConfiguration {
  readonly client_id: string;
  readonly project_id: string;
  readonly auth_uri: string;
  readonly token_uri: string;
  readonly auth_provider_x509_cert_url: string;
  readonly client_secret: string;
  readonly redirect_uris: string[];
}

export interface AuthorizeQueryOptions {
  clientId: string;
  redirectUri: string;
  responseType: string;
  scope: string;
  accessType?: 'online' | 'offline';
  state?: string;
  includeGrantedScopes?: boolean;
  loginHint?: string;
  prompt?: 'none' | 'consent' | 'select_account';
}

export interface AuthorizationToken {
  readonly access_token: string;
  readonly expires_in: number;
  readonly refresh_token: string;
  readonly scope: string;
  readonly token_type: string;
  readonly created_at?: number;
}

export interface YoutubePaging<T extends Snippet> {
  readonly kind: string;
  readonly etag: string;
  readonly nextPageToken: string;
  readonly prevPageToken: string;
  readonly pageInfo: { totalResults: number, resultsPerPage: number };
  readonly items: Details<T>[];
}

export interface Details<T extends Snippet> {
  readonly kind: string;
  readonly etag: string;
  readonly id: string;
  readonly snippet?: T;
  readonly contentDetails?: ContentDetails;
}

export interface Snippet {
  readonly description: string;
  readonly localized: { title: string, description: string };
  readonly publishedAt: string;
  readonly thumbnails: { default: Image, standard: Image, medium: Image, high: Image };
  readonly title: string;
}

export interface ContentDetails {
  readonly videoId: string;
  readonly startAt: string;
  readonly endAt: string;
  readonly note: string;
  readonly videoPublishedAt: string;
}

export interface PlaylistOverview extends Snippet {
  readonly channelId: string;
  readonly channelTitle: string;
}

export interface Image {
  readonly height: number;
  readonly url: string;
  readonly width: number;
}

export interface PlaylistItem extends PlaylistOverview {
  readonly playlistId: string,
  readonly position: number,
  readonly resourceId: { kind: string, videoId: string, }
}
