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
  MenusComponent,
  FileComponent,
  FilesComponent
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
        path: 'list/:filter/:value',
        component: SlidesComponent
      },
      {
        path: 'form',
        component: SlideComponent
      },
      {
        path: 'form/:filter/:value',
        component: SlideComponent
      },
      {
        path: 'form/:filter/:value',
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
        path: 'list/:filter/:value',
        component: PagesComponent,
        canActivate: [SignInGuard]
      },
      {
        path: 'form',
        component: PageComponent,
        canActivate: [SignInGuard]
      },
      {
        path: 'form/:filter',
        component: PageComponent,
        canActivate: [SignInGuard]
      },
      {
        path: 'form/:filter/:value',
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
        path: 'form/:filter',
        component: MenuComponent,
        canActivate: [SignInGuard]
      },
      {
        path: 'form/:filter/:value',
        component: MenuComponent,
        canActivate: [SignInGuard]
      }
    ]
  },
  {
    path: 'file',
    canActivate: [SignInGuard],
    children: [
      {
        path: 'list',
        component: FilesComponent,
        canActivate: [SignInGuard]
      },
      {
        path: 'list/:filter',
        component: FilesComponent,
        canActivate: [SignInGuard]
      },
      {
        path: 'list/:filter/:value',
        component: FilesComponent,
        canActivate: [SignInGuard]
      },
      {
        path: 'form',
        component: FileComponent,
        canActivate: [SignInGuard]
      },
      {
        path: 'form/:filter',
        component: FileComponent,
        canActivate: [SignInGuard]
      },
      {
        path: 'form/:filter/:value',
        component: FileComponent,
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
