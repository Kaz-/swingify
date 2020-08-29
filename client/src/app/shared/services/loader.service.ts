import { Injectable, NgZone, Renderer2, RendererFactory2, ElementRef } from '@angular/core';
import { RouterEvent, NavigationStart } from '@angular/router';

@Injectable()
export class LoaderService {

  private renderer: Renderer2;

  constructor(
    private ngZone: NgZone,
    private rendererFactory: RendererFactory2
  ) {
    this.renderer = rendererFactory.createRenderer(null, null);
  }

  navigationInterceptor(event: RouterEvent, loader: ElementRef): void {
    switch (event.constructor) {
      case NavigationStart:
        this.showLoader(loader);
        break;
      default:
        this.hideLoader(loader);
        break;
    }
  }

  private showLoader(loader: ElementRef): void {
    this.ngZone.runOutsideAngular(() => this.renderer.setStyle(loader.nativeElement, 'display', 'flex'));
  }

  private hideLoader(loader: ElementRef): void {
    this.ngZone.runOutsideAngular(() => this.renderer.setStyle(loader.nativeElement, 'display', 'none'));
  }
}
