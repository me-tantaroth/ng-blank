import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SlideComponent, SlidesComponent } from './layout-content';

import { SignInGuard } from '../auth/guards/sign-in.guard';

const routes: Routes = [
  {
    path: 'list',
    component: SlidesComponent,
    canActivate: [SignInGuard]
  },
  {
    path: 'list/:filter',
    component: SlidesComponent,
    canActivate: [SignInGuard]
  },
  {
    path: 'form',
    component: SlideComponent,
    canActivate: [SignInGuard]
  },
  {
    path: 'form/:id',
    component: SlideComponent,
    canActivate: [SignInGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SlidesRoutingModule {}