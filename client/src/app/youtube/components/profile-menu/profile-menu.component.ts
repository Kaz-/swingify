import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

import { NavLink } from '../../../shared/models/shared.models';
import { Details, Snippet } from '../../models/youtube.models';

import { YoutubeAuthService } from '../../../shared/services/youtube-auth.service';

@Component({
  selector: 'swg-profile-menu',
  templateUrl: './profile-menu.component.html',
  styleUrls: ['./profile-menu.component.scss']
})
export class ProfileMenuComponent {

  @Input() user$: Observable<Details<Snippet>>;
  @Input() isSecondary?: boolean;

  isMenuActive: boolean;

  constructor(private router: Router) { }

  generateUserLinks(user: Details<Snippet>): NavLink[] {
    return [
      {
        name: 'Profile',
        link: `${environment.youtube.external.channel}/${user.id}`
      },
      {
        name: 'Privacy',
        link: '/privacy-policy'
      },
      {
        name: 'Log out',
        link: 'home',
        action: () => YoutubeAuthService.removeToken()
      }
    ];
  }

  handle(): void {
    this.isMenuActive = !this.isMenuActive;
  }

}
