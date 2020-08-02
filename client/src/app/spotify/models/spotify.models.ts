export interface SpotifyEnvironment {
  clientId: string;
  accountsPath?: string;
  apiPath?: string;
}

export interface AuthorizeQueryOptions {
  clientId: string;
  responseType: string;
  redirectUri: string;
  scope?: string;
  state?: string;
  showDialog?: boolean;
}
