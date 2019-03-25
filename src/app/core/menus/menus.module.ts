import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgBarnModule } from 'ng-barn';
import { MaterialModule } from '../../material.module';
import { CovalentModule } from '../../covalent.module';
import { LayoutAdminModule } from '../../admin/layout-admin/layout-admin.module';
import { SharedModule } from '../../shared/shared.module';

import { MenuListComponent, MenuFormComponent } from './components';

@NgModule({
  declarations: [MenuListComponent, MenuFormComponent],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    NgBarnModule,
    MaterialModule,
    CovalentModule,
    LayoutAdminModule,
    SharedModule
  ],
  exports: [MenuListComponent, MenuFormComponent]
})
export class MenusModule {}
