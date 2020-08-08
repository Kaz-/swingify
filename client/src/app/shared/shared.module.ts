import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { LoginComponent } from './components/login/login.component';
import { ProcessComponent } from './components/process/process.component';
import { HomeComponent } from './components/home/home.component';

@NgModule({
  declarations: [LoginComponent, ProcessComponent, HomeComponent],
  imports: [
    CommonModule,
    RouterModule
  ],
  exports: []
})
export class SharedModule { }
