import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LoginComponent } from './shared/components/login/login.component';
import { ProcessComponent } from './shared/components/process/process.component';
import { HomeComponent } from './shared/components/home/home.component';

import { MainComponent } from './spotify/components/main/main.component';
import { ExportComponent } from './spotify/components/export/export.component';

import { AuthGuard } from './shared/guards/auth.guard';
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
    component: MainComponent,
    canActivate: [AuthGuard],
    canActivateChild: [AuthGuard],
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
