import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { HomeComponent } from './components/home/home.component';
import { MainComponent } from './components/main/main.component';
import { LoginComponent } from './components/login/login.component';

@NgModule({
  declarations: [HomeComponent, MainComponent, LoginComponent],
  imports: [
    CommonModule,
    RouterModule
  ],
  exports: [MainComponent]
})
export class SharedModule { }
