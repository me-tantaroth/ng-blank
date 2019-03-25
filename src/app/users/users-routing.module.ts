import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SignInGuard } from '../auth/guards/sign-in.guard';

import {
  UsersComponent,
  UserComponent,
  RecoveryComponent,
  ProfileComponent
} from './layout-content';

const routes: Routes = [
  {
    path: 'list',
    component: UsersComponent,
    canActivate: [SignInGuard]
  },
  {
    path: 'list/:filter',
    component: UsersComponent,
    canActivate: [SignInGuard]
  },
  {
    path: 'form',
    component: UserComponent,
    canActivate: [SignInGuard]
  },
  {
    path: 'form/:id',
    component: UserComponent,
    canActivate: [SignInGuard]
  },
  {
    path: 'profile',
    component: ProfileComponent,
    canActivate: [SignInGuard]
  },
  {
    path: 'recovery',
    component: RecoveryComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UsersRoutingModule {}
