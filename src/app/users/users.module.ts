import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgBarnModule } from 'ng-barn';
import { UsersRoutingModule } from './users-routing.module';
import { MaterialModule } from '../material.module';
import { CovalentModule } from '../covalent.module';
import { LayoutsModule } from '../layouts/layouts.module';

import {
  UsersComponent,
  UserComponent,
  UserViewComponent,
  RecoveryComponent,
  ProfileComponent
} from './layout-content';
import {
  UserListComponent,
  UserFormComponent,
  UserInfoComponent
} from './components';

@NgModule({
  declarations: [
    UserListComponent,
    UsersComponent,
    UserComponent,
    UserFormComponent,
    RecoveryComponent,
    ProfileComponent,
    UserViewComponent,
    UserInfoComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgBarnModule,
    MaterialModule,
    CovalentModule,
    LayoutsModule,
    UsersRoutingModule
  ],
  exports: [UserListComponent, UserFormComponent]
})
export class UsersModule {}
