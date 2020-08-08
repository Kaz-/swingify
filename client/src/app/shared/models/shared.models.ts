export interface NavLink {
  name: string;
  link: string;
  icon: string;
}

export const NAV_LINKS: NavLink[] = [
  {
    name: 'Home',
    link: '/home',
    icon: 'home'
  },
  {
    name: 'Search',
    link: '/search',
    icon: 'search'
  },
  {
    name: 'Export',
    link: '/spotify/export',
    icon: 'magic'
  }
];
