import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './shared/components/home/home.component';
import { ProcessComponent } from './spotify/components/process/process.component';
import { ExportComponent } from './spotify/components/export/export.component';


const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    pathMatch: 'full',
  },
  {
    path: 'spotify',
    children: [
      {
        path: 'process',
        component: ProcessComponent
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
