import { Location } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Router, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';

import { SpotifyUser } from 'src/app/spotify/models/spotify.models';
import { NavLink } from '../../models/shared.models';

import { AuthService } from '../../../spotify/services/auth.service';

@Component({
  selector: 'swg-profile-menu',
  templateUrl: './profile-menu.component.html',
  styleUrls: ['./profile-menu.component.scss']
})
export class ProfileMenuComponent {

  @Input() user$: Observable<SpotifyUser>;
  @Input() isSecondary?: boolean;

  isMenuActive: boolean;

  constructor(private router: Router, private location: Location) { }

  generateUserLinks(user: SpotifyUser): NavLink[] {
    return [
      {
        name: 'Profile',
        link: user.external_urls.spotify
      },
      {
        name: 'Privacy',
        link: '/privacy-policy'
      },
      {
        name: 'Log out',
        link: this.isSecondary ? this.redirect() : 'login',
        action: () => this.isSecondary ? AuthService.removeSecondaryToken() : AuthService.removeToken()
      }
    ];
  }

  handle(): void {
    this.isMenuActive = !this.isMenuActive;
  }

  redirect(): string {
    const url: UrlTree = this.router.parseUrl(this.router.url);
    url.queryParams = { p: url.queryParams.p }; // remove secondary part
    return this.router.serializeUrl(url);
  }

}
