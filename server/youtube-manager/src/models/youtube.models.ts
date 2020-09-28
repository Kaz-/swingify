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
