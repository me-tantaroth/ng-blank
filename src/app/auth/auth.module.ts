import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LayoutsModule } from '../layouts/layouts.module';
import { AuthRoutingModule } from './auth-routing.module';

import { LoginComponent } from './pages';

@NgModule({
  declarations: [LoginComponent],
  imports: [
    CommonModule,
    LayoutsModule,
    AuthRoutingModule
  ]
})
export class AuthModule { }
