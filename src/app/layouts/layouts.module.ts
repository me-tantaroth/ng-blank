import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MaterialModule } from '../material.module';

import { LayoutDefaultComponent } from './layout-default/layout-default.component';
import { NavbarDefaultComponent } from './components/navbar-default/navbar-default.component';

@NgModule({
  declarations: [LayoutDefaultComponent, NavbarDefaultComponent],
  imports: [
    CommonModule,
    RouterModule,
    MaterialModule
  ],
  exports: [LayoutDefaultComponent]
})
export class LayoutsModule { }
