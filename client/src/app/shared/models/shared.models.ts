export enum AuthPlatform {
  SPOTIFY = 'Spotify',
  YOUTUBE = 'YouTube'
}

export interface NavLink {
  name: string;
  link?: string;
  icon?: string;
  action?: () => void;
}

export interface PlaylistAction {
  trackUri: string;
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
  400, 401, 403, 404, 500, 504
];
