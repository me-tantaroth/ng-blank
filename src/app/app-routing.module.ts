import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdminModule } from './admin/admin.module';

import {
  HomeComponent,
  NotFoundComponent,
  SignInComponent,
  SignUpComponent,
  SignOutComponent,
  RecoveryComponent,
  UserViewComponent,
  PageViewComponent
} from './view-content';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent
  },
  {
    path: 'auth',
    children: [
      {
        path: 'sign-in',
        component: SignInComponent
      },
      {
        path: 'sign-out',
        component: SignOutComponent
      },
      {
        path: 'sign-up',
        component: SignUpComponent
      },
      {
        path: 'recovery',
        component: RecoveryComponent
      }
    ]
  },
  {
    path: 'page',
    children: [
      {
        path: 'view/:pageId',
        component: PageViewComponent
      }
    ]
  },
  {
    path: 'user',
    children: [
      {
        path: 'user/view/:id',
        component: UserViewComponent
      }
    ]
  },
  {
    path: 'not-found',
    component: NotFoundComponent
  },
  {
    path: 'admin',
    loadChildren: () => AdminModule
  },
  {
    path: '**',
    component: NotFoundComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
