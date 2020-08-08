import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LoginComponent } from './shared/components/login/login.component';
import { ProcessComponent } from './shared/components/process/process.component';
import { HomeComponent } from './shared/components/home/home.component';

import { MainComponent } from './spotify/components/main/main.component';
import { ExportComponent } from './spotify/components/export/export.component';


const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
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
    component: MainComponent,
    children: [
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full'
      },
      {
        path: 'home',
        component: HomeComponent,
      },
      {
        path: 'export',
        component: ExportComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
