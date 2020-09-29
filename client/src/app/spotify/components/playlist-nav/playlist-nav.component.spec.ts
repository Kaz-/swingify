import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlaylistNavComponent } from './playlist-nav.component';

describe('PlaylistNavComponent', () => {
  let component: PlaylistNavComponent;
  let fixture: ComponentFixture<PlaylistNavComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlaylistNavComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlaylistNavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
