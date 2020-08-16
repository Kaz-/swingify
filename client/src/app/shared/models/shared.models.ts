export enum AuthPlatform {
  SPOTIFY = 'Spotify',
  YOUTUBE = 'YouTube'
}

export interface NavLink {
  name: string;
  link: string;
  icon: string;
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
  trackUris: string[];
  action: ETrackAction;
}

export enum ETrackAction {
  ADD = 'add',
  REMOVE = 'remove'
}
