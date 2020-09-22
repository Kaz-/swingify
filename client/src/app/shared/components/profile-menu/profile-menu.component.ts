import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

import { SpotifyUser } from 'src/app/spotify/models/spotify.models';
import { NavLink } from '../../models/shared.models';

import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'swg-profile-menu',
  templateUrl: './profile-menu.component.html',
  styleUrls: ['./profile-menu.component.scss']
})
export class ProfileMenuComponent {

  @Input() user$: Observable<SpotifyUser>;
  @Input() isSecondary?: boolean;

  isMenuActive: boolean;

  constructor(private router: Router) { }

  generateUserLinks(user: SpotifyUser): NavLink[] {
    return [{
      name: 'Profile',
      link: user.external_urls.spotify
    },
    {
      name: 'Disconnect',
      link: this.isSecondary ? this.redirect() : 'login',
      action: () => this.isSecondary ? AuthService.removeSecondaryToken() : AuthService.removeToken()
    }];
  }

  handle(): void {
    this.isMenuActive = !this.isMenuActive;
  }

  redirect(): string {
    return this.router.url.split('s=')[0]; // remove secondary part
  }

}
