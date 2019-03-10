import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgBarnModule } from 'ng-barn';
import { UsersRoutingModule } from './users-routing.module';
import { MaterialModule } from '../material.module';
import { LayoutsModule } from '../layouts/layouts.module';

import { UsersComponent, UserComponent } from './pages';
import { UserListComponent, UserFormComponent } from './components';

@NgModule({
  declarations: [
    UserListComponent,
    UsersComponent,
    UserComponent,
    UserFormComponent
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
  exports: [UserListComponent, UserFormComponent]
})
export class UsersModule {}
