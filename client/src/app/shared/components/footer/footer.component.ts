import { Component } from '@angular/core';

@Component({
  selector: 'swg-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent {

  getYear(): number {
    return new Date().getFullYear();
  }

}
