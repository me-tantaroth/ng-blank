import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SignInGuard } from '../core/auth/guards/sign-in.guard';

import {
  DashboardComponent,
  TrashComponent,
  UsersComponent,
  UserComponent,
  ProfileComponent,
  SlideComponent,
  SlidesComponent,
  PagesComponent,
  PageComponent,
  MenuComponent,
  MenusComponent
} from './view-content';

const routes: Routes = [
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [SignInGuard]
  },
  {
    path: 'trash',
    component: TrashComponent,
    canActivate: [SignInGuard]
  },
  {
    path: 'user',
    canActivate: [SignInGuard],
    children: [
      {
        path: 'list',
        component: UsersComponent
      },
      {
        path: 'list/:filter',
        component: UsersComponent
      },
      {
        path: 'form',
        component: UserComponent
      },
      {
        path: 'form/:uid',
        component: UserComponent
      },
      {
        path: 'profile',
        component: ProfileComponent
      }
    ]
  },
  {
    path: 'slide',
    canActivate: [SignInGuard],
    children: [
      {
        path: 'list',
        component: SlidesComponent
      },
      {
        path: 'list/:filter',
        component: SlidesComponent
      },
      {
        path: 'form',
        component: SlideComponent
      },
      {
        path: 'form/:uid',
        component: SlideComponent
      }
    ]
  },
  {
    path: 'page',
    canActivate: [SignInGuard],
    children: [
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
        path: 'form/:uid',
        component: PageComponent,
        canActivate: [SignInGuard]
      }
    ]
  },
  {
    path: 'menu',
    canActivate: [SignInGuard],
    children: [
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
        path: 'list/:filter/:value',
        component: MenusComponent,
        canActivate: [SignInGuard]
      },
      {
        path: 'form',
        component: MenuComponent,
        canActivate: [SignInGuard]
      },
      {
        path: 'form/:action',
        component: MenuComponent,
        canActivate: [SignInGuard]
      },
      {
        path: 'form/:action/:path',
        component: MenuComponent,
        canActivate: [SignInGuard]
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule {}
