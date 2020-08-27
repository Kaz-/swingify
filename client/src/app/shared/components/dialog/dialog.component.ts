import { Component, Input, Output, EventEmitter, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { DialogInput } from '../../models/shared.models';

@Component({
  selector: 'exp-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss']
})
export class DialogComponent implements AfterViewInit {

  @Input() entry: DialogInput;
  @Output() cancel: EventEmitter<void> = new EventEmitter<void>();
  @Output() action: EventEmitter<string> = new EventEmitter<string>();
  @ViewChild('input') inputElement: ElementRef;

  inputControl: FormControl = new FormControl('');

  ngAfterViewInit(): void {
    this.inputElement.nativeElement.focus();
  }

  onCancel(): void {
    this.cancel.emit();
  }

  onAction(): void {
    this.action.emit(this.inputControl.value);
  }

}
