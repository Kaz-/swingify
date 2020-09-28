import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from '../shared/components/home/home.component';

import { YoutubeAuthGuard } from '../shared/guards/youtube-auth.guard';


const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    canActivate: [YoutubeAuthGuard],
    canActivateChild: [YoutubeAuthGuard],
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
        component: HomeComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class YoutubeRoutingModule { }
