import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SignInComponent, SignUpComponent } from './pages';

const routes: Routes = [{
  path: 'sign-in',
  component: SignInComponent
}, {
  path: 'sign-up',
  component: SignUpComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule { }
