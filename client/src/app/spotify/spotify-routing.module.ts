import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MainComponent } from '../spotify/components/main/main.component';
import { HomeComponent } from '../shared/components/home/home.component';
import { ExportComponent } from '../spotify/components/export/export.component';

import { SpotifyAuthGuard } from '../shared/guards/spotify-auth.guard';


const routes: Routes = [
  {
    path: '',
    component: MainComponent,
    canActivate: [SpotifyAuthGuard],
    canActivateChild: [SpotifyAuthGuard],
    children: [
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full'
      },
      {
        path: 'home',
        component: HomeComponent
      },
      {
        path: 'export',
        component: ExportComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SpotifyRoutingModule { }
