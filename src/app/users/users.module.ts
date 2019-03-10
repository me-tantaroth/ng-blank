import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgBarnModule } from 'ng-barn';
import { UsersRoutingModule } from './users-routing.module';
import { MaterialModule } from '../material.module';
import { LayoutsModule } from '../layouts/layouts.module';

import { UsersComponent, UserComponent } from './pages';
import { UserListComponent, UserFormComponent, ModalUserListComponent } from './components';

@NgModule({
  declarations: [
    UserListComponent,
    UsersComponent,
    UserComponent,
    UserFormComponent,
    ModalUserListComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgBarnModule,
    MaterialModule,
    LayoutsModule,
    UsersRoutingModule
  ],
  exports: [UserListComponent, UserFormComponent, ModalUserListComponent]
})
export class UsersModule {}
