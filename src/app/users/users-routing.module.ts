import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SignInGuard } from '../auth/guards/sign-in.guard';

import { UsersComponent, UserComponent, RecoveryComponent } from './pages';

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
  },
  {
    path: 'form/:id',
    component: UserComponent,
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
