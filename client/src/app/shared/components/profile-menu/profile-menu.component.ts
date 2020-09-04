import { Component, Input } from '@angular/core';
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

  generateUserLinks(user: SpotifyUser): NavLink[] {
    return [{
      name: 'Profile',
      link: user.external_urls.spotify
    },
    {
      name: 'Disconnect',
      link: location.href,
      action: () => this.isSecondary ? AuthService.removeSecondaryToken() : AuthService.removeToken()
    }];
  }

  handle(): void {
    this.isMenuActive = !this.isMenuActive;
  }

}
