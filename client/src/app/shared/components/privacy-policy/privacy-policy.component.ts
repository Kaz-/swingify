import { Location } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'swg-privacy-policy',
  templateUrl: './privacy-policy.component.html',
  styleUrls: ['./privacy-policy.component.scss']
})
export class PrivacyPolicyComponent {

  constructor(private location: Location) { }

  back(): void {
    this.location.back();
  }

}
