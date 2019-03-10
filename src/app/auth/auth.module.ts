import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgBarnModule } from 'ng-barn';
import { MaterialModule } from '../material.module';
import { CovalentModule } from '../covalent.module';
import { LayoutsModule } from '../layouts/layouts.module';
import { AuthRoutingModule } from './auth-routing.module';

import { SignInComponent, SignUpComponent, SignOutComponent } from './pages';
import { SignInFormComponent } from './components';

import { AuthService } from './services/auth.service';

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
    AuthRoutingModule
  ],
  exports: [SignInFormComponent],
  providers: [AuthService]
})
export class AuthModule {}
