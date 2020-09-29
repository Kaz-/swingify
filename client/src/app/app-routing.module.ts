import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DashboardComponent } from './shared/components/dashboard/dashboard.component';
import { ProcessComponent } from './shared/components/process/process.component';
import { PrivacyPolicyComponent } from './shared/components/privacy-policy/privacy-policy.component';
import { ErrorComponent } from './shared/components/error/error.component';


const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full',
  },
  {
    path: 'dashboard',
    component: DashboardComponent
  },
  {
    path: 'process',
    component: ProcessComponent
  },
  {
    path: 'spotify',
    loadChildren: () => import('./spotify/spotify.module').then(m => m.SpotifyModule)
  },
  {
    path: 'youtube',
    loadChildren: () => import('./youtube/youtube.module').then(m => m.YoutubeModule)
  },
  {
    path: 'privacy-policy',
    component: PrivacyPolicyComponent
  },
  {
    path: 'error/:status',
    component: ErrorComponent
  },
  {
    path: '**',
    redirectTo: 'error/404'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
