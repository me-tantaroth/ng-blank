import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SignInGuard } from '../auth/guards/sign-in.guard';

import { UsersComponent, UserComponent } from './pages';

const routes: Routes = [
  {
    path: 'list',
    component: UsersComponent,
    canActivate: [SignInGuard]
  },
  {
    path: 'form',
    component: UserComponent,
    canActivate: [SignInGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UsersRoutingModule {}
