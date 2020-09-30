export interface YoutubePaging<T extends Snippet> {
  readonly kind: string;
  readonly etag: string;
  readonly nextPageToken: string;
  readonly prevPageToken: string;
  readonly pageInfo: { totalResults: number, resultsPerPage: number };
  readonly items: Details<T>[];
  fromNext?: boolean;
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
  readonly playlistId: string;
  readonly position: number;
  readonly resourceId: { kind: string, videoId: string };
}
