import { Observable } from 'rxjs';

export enum Platform {
  SPOTIFY = 'Spotify',
  YOUTUBE = 'YouTube'
}

export interface AuthorizationToken {
  readonly access_token: string;
  readonly expires_in: number;
  readonly refresh_token: string;
  readonly scope: string;
  readonly token_type: string;
  created_at?: number;
}

export interface NavLink {
  name: string;
  link?: string | Observable<string>;
  icon?: string;
  action?: () => void;
}

export interface PlaylistAction {
  trackId?: string[]; // array of one element due to Spotify API
  trackUri?: string[];
  action: ETrackAction;
  complete?: boolean;
}

export enum ETrackAction {
  ADD = 'add',
  REMOVE = 'remove'
}

export interface DialogInput {
  title?: string;
  label?: string;
  placeholder: string;
  action: string;
}

export interface HttpError {
  error: string;
  message: string;
  statusCode: number;
}

export const SUPPORTED_ERRORS: number[] = [
  401, 403, 404, 504
];
