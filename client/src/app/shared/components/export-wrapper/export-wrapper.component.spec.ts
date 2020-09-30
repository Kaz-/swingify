import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExportWrapperComponent } from './export-wrapper.component';

describe('ExportWrapperComponent', () => {
  let component: ExportWrapperComponent;
  let fixture: ComponentFixture<ExportWrapperComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExportWrapperComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExportWrapperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
