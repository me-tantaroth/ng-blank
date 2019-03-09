import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LayoutsModule } from '../layouts/layouts.module';
import { AuthRoutingModule } from './auth-routing.module';

import { SignInComponent, SignUpComponent } from './pages';

@NgModule({
  declarations: [SignUpComponent, SignInComponent],
  imports: [
    CommonModule,
    LayoutsModule,
    AuthRoutingModule
  ]
})
export class AuthModule { }
