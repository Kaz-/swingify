import { Component } from '@angular/core';
import { Router, UrlTree } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

import { environment } from '../../../../environments/environment';

@Component({
  selector: 'swg-export-wrapper',
  templateUrl: './export-wrapper.component.html',
  styleUrls: ['./export-wrapper.component.scss']
})
export class ExportWrapperComponent {

  constructor(
    private router: Router,
    private toastr: ToastrService
  ) { }

  getHelp(): string {
    return 'If you want to share your playlist, you can click\n' +
      'on this button or directly copy the URL from\n' +
      'your browser with the "p" parameter only.\n' +
      'Also make sure that your playlist is public.';
  }

  share(): void {
    const dummy = document.createElement('input');
    const url: UrlTree = this.router.parseUrl(this.router.url);
    url.queryParams = { p: url.queryParams.p }; // remove secondary part
    dummy.value = `${environment.baseUrl}${this.router.serializeUrl(url)}`;
    document.body.appendChild(dummy);
    dummy.focus();
    dummy.select();
    document.execCommand('copy');
    document.body.removeChild(dummy);
    this.toastr.info('Copied to clipboard!', null, { progressBar: true, timeOut: 2000 });
  }

}
