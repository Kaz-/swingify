import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'swg-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss']
})
export class CardComponent {

  @Input() platform: string;
  @Input() authenticated?: boolean;
  @Output() auth: EventEmitter<string> = new EventEmitter<string>();

  authenticate(): void {
    this.auth.emit(this.platform);
  }

}
