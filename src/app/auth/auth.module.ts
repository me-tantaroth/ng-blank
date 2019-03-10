import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgBarnModule } from 'ng-barn';
import { MaterialModule } from '../material.module';
import { LayoutsModule } from '../layouts/layouts.module';
import { AuthRoutingModule } from './auth-routing.module';

import { SignInComponent, SignUpComponent } from './pages';
import { SignInFormComponent } from './components/sign-in-form/sign-in-form.component';

import { AuthService } from './services/auth.service';
import { SignOutComponent } from './pages/sign-out/sign-out.component';

@NgModule({
  declarations: [SignUpComponent, SignInComponent, SignInFormComponent, SignOutComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgBarnModule,
    MaterialModule,
    LayoutsModule,
    AuthRoutingModule
  ],
  providers: [AuthService]
})
export class AuthModule {}
