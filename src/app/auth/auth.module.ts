import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgBarnModule } from 'ng-barn';
import { MaterialModule } from '../material.module';
import { CovalentModule } from '../covalent.module';
import { LayoutsModule } from '../layouts/layouts.module';
import { SharedModule } from '../shared/shared.module';
import { UsersModule } from '../users/users.module';
import { AuthRoutingModule } from './auth-routing.module';

import { AuthService } from './services/auth.service';

import { SignInComponent, SignUpComponent, SignOutComponent } from './pages';
import { SignInFormComponent } from './components';

@NgModule({
  declarations: [SignUpComponent, SignInComponent, SignInFormComponent, SignOutComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgBarnModule,
    MaterialModule,
    CovalentModule,
    LayoutsModule,
    SharedModule,
    UsersModule,
    AuthRoutingModule
  ],
  exports: [SignInFormComponent],
  providers: [AuthService]
})
export class AuthModule {}
