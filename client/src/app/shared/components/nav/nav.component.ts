import { Component, OnInit, OnDestroy, AfterViewInit, ElementRef, Input, ViewChild, Output, EventEmitter } from '@angular/core';
import { Router, RouterEvent } from '@angular/router';
import { Observable, Subscription } from 'rxjs';

import { environment } from '../../../../environments/environment';

import { NavLink, DialogInput } from '../../models/shared.models';
import { LoaderService } from '../../services/loader.service';

@Component({
  selector: 'swg-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})
export class NavComponent<T> implements OnInit, OnDestroy, AfterViewInit {

  @Input() user$: Observable<T>;
  @Input() navLinks: NavLink[];
  @Output() search: EventEmitter<string> = new EventEmitter<string>();
  @ViewChild('loader') loader: ElementRef;

  version: string = environment.productVersion;
  subscription: Subscription;
  isSearching: boolean;
  dialog: DialogInput;

  constructor(
    private router: Router,
    private loaderService: LoaderService
  ) { }

  ngOnInit(): void {
    this.initializeDialog();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  ngAfterViewInit(): void {
    this.subscription = this.router.events.subscribe((event: RouterEvent) =>
      this.loaderService.navigationInterceptor(event, this.loader));
  }

  private initializeDialog(): void {
    this.dialog = {
      title: 'Search a playlist to export',
      label: `Playlist's name`,
      placeholder: 'Search in playlists',
      action: 'Search'
    };
  }

  onSearch(playlistName: string): void {
    this.search.emit(playlistName);
  }

}
