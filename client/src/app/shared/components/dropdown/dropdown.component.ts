import { Component, Input } from '@angular/core';
import { NavLink } from '../../models/shared.models';

@Component({
  selector: 'exp-dropdown',
  templateUrl: './dropdown.component.html',
  styleUrls: ['./dropdown.component.scss']
})
export class DropdownComponent {

  @Input() items: NavLink[];

}
