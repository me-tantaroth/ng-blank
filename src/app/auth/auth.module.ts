import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgBarnModule } from 'ng-barn';
import { LayoutsModule } from '../layouts/layouts.module';
import { AuthRoutingModule } from './auth-routing.module';

import { SignInComponent, SignUpComponent } from './pages';

@NgModule({
  declarations: [SignUpComponent, SignInComponent],
  imports: [
    CommonModule,
    FormsModule, ReactiveFormsModule,
    NgBarnModule,
    LayoutsModule,
    AuthRoutingModule
  ]
})
export class AuthModule { }
