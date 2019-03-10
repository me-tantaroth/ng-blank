import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { MaterialModule } from '../material.module';
import { CovalentModule } from '../covalent.module';

import { LayoutDefaultComponent } from './layout-default/layout-default.component';
import { NavbarDefaultComponent } from './components/navbar-default/navbar-default.component';
import { LayoutAdminComponent } from './layout-admin/layout-admin.component';

@NgModule({
  declarations: [LayoutDefaultComponent, NavbarDefaultComponent, LayoutAdminComponent],
  imports: [
    CommonModule,
    RouterModule,
    HttpClientModule,
    MaterialModule,
    CovalentModule
  ],
  exports: [LayoutDefaultComponent, LayoutAdminComponent]
})
export class LayoutsModule { }
