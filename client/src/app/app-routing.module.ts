import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LoginComponent } from './shared/components/login/login.component';
import { ProcessComponent } from './shared/components/process/process.component';

import { ErrorComponent } from './shared/components/error/error.component';


const routes: Routes = [
  {
    path: '',
    redirectTo: 'spotify',
    pathMatch: 'full',
  },
  {
    path: 'login',
    component: LoginComponent,
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
