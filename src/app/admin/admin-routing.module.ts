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
          route: ['|user|list|read'],
        }
      },
      {
        path: 'enabled/:filter',
        component: UsersComponent,
        canActivate: [PermissionGuard],
        data: {
          route: ['|user|list|read'],
        }
      },
      {
        path: 'enabled/:filter/:value',
        component: UsersComponent,
        canActivate: [PermissionGuard],
        data: {
          route: ['|user|list|read'],
        }
      },
      {
        path: 'form',
        component: UserComponent,
        canActivate: [SignInGuard],
        data: {
          route: ['|user|list|write', '|user|list|create', '|user|list|update'],
        }
      },
      {
        path: 'form/:filter',
        component: UserComponent,
        canActivate: [SignInGuard],
        data: {
          route: ['|user|list|write', '|user|list|create', '|user|list|update'],
        }
      },
      {
        path: 'form/:filter/:value',
        component: UserComponent,
        canActivate: [SignInGuard],
        data: {
          route: ['|user|list|write', '|user|list|create', '|user|list|update'],
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
          route: ['slide_read'],
        }
      },
      {
        path: 'enabled/:filter',
        component: SlidesComponent,
        canActivate: [PermissionGuard],
        data: {
          route: ['slide_read'],
        }
      },
      {
        path: 'enabled/:filter/:value',
        component: SlidesComponent,
        canActivate: [PermissionGuard],
        data: {
          route: ['slide_read'],
        }
      },
      {
        path: 'form',
        component: SlideComponent,
        canActivate: [PermissionGuard],
        data: {
          route: ['slide_write'],
        }
      },
      {
        path: 'form/:filter',
        component: SlideComponent,
        canActivate: [PermissionGuard],
        data: {
          route: ['slide_write'],
        }
      },
      {
        path: 'form/:filter/:value',
        component: SlideComponent,
        canActivate: [PermissionGuard],
        data: {
          route: ['slide_write'],
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
        canActivate: [SignInGuard],
        data: {
          route: 'SLIDES_VIEW',
        }
      },
      {
        path: 'enabled/:filter',
        component: PagesComponent,
        canActivate: [SignInGuard],
        data: {
          route: 'SLIDES_VIEW',
        }
      },
      {
        path: 'enabled/:filter/:value',
        component: PagesComponent,
        canActivate: [SignInGuard],
        data: {
          route: 'SLIDES_VIEW',
        }
      },
      {
        path: 'form',
        component: PageComponent,
        canActivate: [SignInGuard],
        data: {
          route: 'SLIDES_WRITE',
        }
      },
      {
        path: 'form/:filter',
        component: PageComponent,
        canActivate: [SignInGuard],
        data: {
          route: 'SLIDES_WRITE',
        }
      },
      {
        path: 'form/:filter/:value',
        component: PageComponent,
        canActivate: [SignInGuard],
        data: {
          route: 'SLIDES_WRITE',
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
        canActivate: [SignInGuard],
        data: {
          route: 'MENU_VIEW',
        }
      },
      {
        path: 'enabled/:filter',
        component: MenusComponent,
        canActivate: [SignInGuard],
        data: {
          route: 'MENU_VIEW',
        }
      },
      {
        path: 'enabled/:filter/:value',
        component: MenusComponent,
        canActivate: [SignInGuard],
        data: {
          route: 'MENU_VIEW',
        }
      },
      {
        path: 'form',
        component: MenuComponent,
        canActivate: [SignInGuard],
        data: {
          route: 'MENU_WRITE',
        }
      },
      {
        path: 'form/:filter',
        component: MenuComponent,
        canActivate: [SignInGuard],
        data: {
          route: 'MENU_WRITE',
        }
      },
      {
        path: 'form/:filter/:value',
        component: MenuComponent,
        canActivate: [SignInGuard],
        data: {
          route: 'MENU_WRITE',
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
        canActivate: [SignInGuard],
        data: {
          route: 'DRIVE_VIEW',
        }
      },
      {
        path: 'enabled/:filter',
        component: FilesComponent,
        canActivate: [SignInGuard],
        data: {
          route: 'DRIVE_VIEW',
        }
      },
      {
        path: 'enabled/:filter/:value',
        component: FilesComponent,
        canActivate: [SignInGuard],
        data: {
          route: 'DRIVE_VIEW',
        }
      },
      {
        path: 'form',
        component: FileComponent,
        canActivate: [SignInGuard],
        data: {
          route: 'DRIVE_WRITE',
        }
      },
      {
        path: 'form/:filter',
        component: FileComponent,
        canActivate: [SignInGuard],
        data: {
          route: 'DRIVE_WRITE',
        }
      },
      {
        path: 'form/:filter/:value',
        component: FileComponent,
        canActivate: [SignInGuard],
        data: {
          route: 'DRIVE_WRITE',
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
