export enum AuthPlatform {
  SPOTIFY = 'Spotify',
  YOUTUBE = 'YouTube'
}

export interface NavLink {
  name: string;
  link: string;
  icon?: string;
  action?: () => void;
}

export const NAV_LINKS: NavLink[] = [
  {
    name: 'Home',
    link: '/spotify/home',
    icon: 'home'
  },
  {
    name: 'Search',
    link: '/search',
    icon: 'search'
  }
];

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
  title: string;
  label: string;
  placeholder: string;
  action: string;
}
