import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgBarnModule } from 'ng-barn';
import { MaterialModule } from '../../material.module';
import { CovalentModule } from '../../covalent.module';
import { SharedModule } from '../../shared/shared.module';
import { UsersModule } from '../users/users.module';
import { PagesModule } from '../pages/pages.module';
import { AuthRoutingModule } from './auth-routing.module';

import { AuthService } from './services/auth.service';

import { SignInFormComponent } from './components';

@NgModule({
  declarations: [
    SignInFormComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgBarnModule,
    MaterialModule,
    CovalentModule,
    SharedModule,
    UsersModule,
    PagesModule,
    AuthRoutingModule
  ],
  exports: [SignInFormComponent],
  providers: [AuthService]
})
export class AuthModule {}
