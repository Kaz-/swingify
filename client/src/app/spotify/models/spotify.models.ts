export interface SpotifyConfiguration {
  clientId: string;
  clientSecret: string;
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
  access_token: string;
  expires_in: number;
  refresh_token: string;
  scope: string;
  token_type: string;
}
