import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SignInGuard } from '../auth/guards/sign-in.guard';

import { PagesComponent, PageComponent, PageViewComponent } from './layout-content';

const routes: Routes = [
  {
    path: 'view/:pageId',
    component: PageViewComponent
  },
  {
    path: 'list',
    component: PagesComponent,
    canActivate: [SignInGuard]
  },
  {
    path: 'list/:filter',
    component: PagesComponent,
    canActivate: [SignInGuard]
  },
  {
    path: 'form',
    component: PageComponent,
    canActivate: [SignInGuard]
  },
  {
    path: 'form/:id',
    component: PageComponent,
    canActivate: [SignInGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagesRoutingModule {}
