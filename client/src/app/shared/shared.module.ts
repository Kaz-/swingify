import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomeComponent } from './components/home/home.component';
import { NavComponent } from './components/nav/nav.component';

@NgModule({
  declarations: [HomeComponent, NavComponent],
  imports: [
    CommonModule
  ]
})
export class SharedModule { }
