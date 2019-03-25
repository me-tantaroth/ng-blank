import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SignInComponent, SignOutComponent, SignUpComponent } from './layout-content';

const routes: Routes = [{
  path: 'sign-in',
  component: SignInComponent
}, {
  path: 'sign-out',
  component: SignOutComponent
}, {
  path: 'sign-up',
  component: SignUpComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule { }
