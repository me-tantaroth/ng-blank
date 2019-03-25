import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgBarnModule } from 'ng-barn';
import { MaterialModule } from '../../material.module';
import { CovalentModule } from '../../covalent.module';
import { LayoutAdminModule } from '../../admin/layout-admin/layout-admin.module';

import {
  UserListComponent,
  UserFormComponent,
  UserInfoComponent
} from './components';

@NgModule({
  declarations: [
    UserListComponent,
    UserFormComponent,
    UserInfoComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    NgBarnModule,
    MaterialModule,
    CovalentModule,
    LayoutAdminModule
  ],
  exports: [UserListComponent, UserFormComponent, UserInfoComponent]
})
export class UsersModule {}
