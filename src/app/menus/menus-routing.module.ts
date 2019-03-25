import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MenuComponent, MenusComponent } from './layout-content';

import { SignInGuard } from '../auth/guards/sign-in.guard';

const routes: Routes = [
  {
    path: 'list',
    component: MenusComponent,
    canActivate: [SignInGuard]
  },
  {
    path: 'list/:filter',
    component: MenusComponent,
    canActivate: [SignInGuard]
  },
  {
    path: 'form',
    component: MenuComponent,
    canActivate: [SignInGuard]
  },
  {
    path: 'form/:id',
    component: MenuComponent,
    canActivate: [SignInGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MenusRoutingModule {}
