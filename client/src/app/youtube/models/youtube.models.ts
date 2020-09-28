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
  readonly snippet: T;
}

export interface Snippet {
  readonly description: string;
  readonly localized: { title: string, description: string };
  readonly publishedAt: string;
  readonly thumbnails: { default: Image, medium: Image, high: Image };
  readonly title: string;
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
