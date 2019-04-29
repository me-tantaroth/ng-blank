import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SignInGuard } from '../core/auth/guards/sign-in.guard';
import { PermissionGuard } from '../core/permissions/guards/permission.guard';

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
    path: 'user',
    canActivate: [SignInGuard],
    children: [
      {
        path: 'enabled',
        component: UsersComponent,
        canActivate: [PermissionGuard],
        data: {
          route: ['user_read']
        }
      },
      {
        path: 'enabled/:filter',
        component: UsersComponent,
        canActivate: [PermissionGuard],
        data: {
          route: ['user_read']
        }
      },
      {
        path: 'enabled/:filter/:value',
        component: UsersComponent,
        canActivate: [PermissionGuard],
        data: {
          route: ['user_read']
        }
      },
      {
        path: 'form',
        component: UserComponent,
        canActivate: [PermissionGuard],
        data: {
          route: ['user_write', 'user_create']
        }
      },
      {
        path: 'form/:filter',
        component: UserComponent,
        canActivate: [PermissionGuard],
        data: {
          route: ['user_write', 'user_create']
        }
      },
      {
        path: 'form/:filter/:value',
        component: UserComponent,
        canActivate: [PermissionGuard],
        data: {
          route: ['user_write', 'user_update']
        }
      }
    ]
  },
  {
    path: 'slide',
    canActivate: [SignInGuard],
    children: [
      {
        path: 'enabled',
        component: SlidesComponent,
        canActivate: [PermissionGuard],
        data: {
          route: ['slide_read']
        }
      },
      {
        path: 'enabled/:filter',
        component: SlidesComponent,
        canActivate: [PermissionGuard],
        data: {
          route: ['slide_read']
        }
      },
      {
        path: 'enabled/:filter/:value',
        component: SlidesComponent,
        canActivate: [PermissionGuard],
        data: {
          route: ['slide_read']
        }
      },
      {
        path: 'form',
        component: SlideComponent,
        canActivate: [PermissionGuard],
        data: {
          route: ['slide_create', 'slide_write']
        }
      },
      {
        path: 'form/:filter',
        component: SlideComponent,
        canActivate: [PermissionGuard],
        data: {
          route: ['slide_write', 'slide_create']
        }
      },
      {
        path: 'form/:filter/:value',
        component: SlideComponent,
        canActivate: [PermissionGuard],
        data: {
          route: ['slide_write', 'slide_update']
        }
      }
    ]
  },
  {
    path: 'page',
    canActivate: [SignInGuard],
    children: [
      {
        path: 'enabled',
        component: PagesComponent,
        canActivate: [PermissionGuard],
        data: {
          route: ['page_read']
        }
      },
      {
        path: 'enabled/:filter',
        component: PagesComponent,
        canActivate: [PermissionGuard],
        data: {
          route: ['page_read']
        }
      },
      {
        path: 'enabled/:filter/:value',
        component: PagesComponent,
        canActivate: [PermissionGuard],
        data: {
          route: ['page_read']
        }
      },
      {
        path: 'form',
        component: PageComponent,
        canActivate: [PermissionGuard],
        data: {
          route: ['page_write', 'page_create']
        }
      },
      {
        path: 'form/:filter',
        component: PageComponent,
        canActivate: [PermissionGuard],
        data: {
          route: ['page_write', 'page_create']
        }
      },
      {
        path: 'form/:filter/:value',
        component: PageComponent,
        canActivate: [PermissionGuard],
        data: {
          route: ['page_write', 'page_update']
        }
      }
    ]
  },
  {
    path: 'menu',
    canActivate: [SignInGuard],
    children: [
      {
        path: 'enabled',
        component: MenusComponent,
        canActivate: [PermissionGuard],
        data: {
          route: ['menu_read']
        }
      },
      {
        path: 'enabled/:filter',
        component: MenusComponent,
        canActivate: [PermissionGuard],
        data: {
          route: ['menu_read']
        }
      },
      {
        path: 'enabled/:filter/:value',
        component: MenusComponent,
        canActivate: [PermissionGuard],
        data: {
          route: ['menu_read']
        }
      },
      {
        path: 'form',
        component: MenuComponent,
        canActivate: [PermissionGuard],
        data: {
          route: ['menu_write', 'menu_create']
        }
      },
      {
        path: 'form/:filter',
        component: MenuComponent,
        canActivate: [PermissionGuard],
        data: {
          route: ['menu_write', 'menu_create']
        }
      },
      {
        path: 'form/:filter/:value',
        component: MenuComponent,
        canActivate: [PermissionGuard],
        data: {
          route: ['menu_write', 'menu_update']
        }
      }
    ]
  },
  {
    path: 'file',
    canActivate: [SignInGuard],
    children: [
      {
        path: 'enabled',
        component: FilesComponent,
        canActivate: [PermissionGuard],
        data: {
          route: ['drive_read']
        }
      },
      {
        path: 'enabled/:filter',
        component: FilesComponent,
        canActivate: [PermissionGuard],
        data: {
          route: ['drive_read']
        }
      },
      {
        path: 'enabled/:filter/:value',
        component: FilesComponent,
        canActivate: [PermissionGuard],
        data: {
          route: ['drive_read']
        }
      },
      {
        path: 'form',
        component: FileComponent,
        canActivate: [PermissionGuard],
        data: {
          route: ['drive_write', 'drive_create']
        }
      },
      {
        path: 'form/:filter',
        component: FileComponent,
        canActivate: [PermissionGuard],
        data: {
          route: ['drive_write', 'drive_create']
        }
      },
      {
        path: 'form/:filter/:value',
        component: FileComponent,
        canActivate: [PermissionGuard],
        data: {
          route: ['drive_write', 'drive_update']
        }
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule {}
