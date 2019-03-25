import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MaterialModule } from '../material.module';
import { CovalentModule } from '../covalent.module';
import { LayoutAdminModule } from './layout-admin/layout-admin.module';
import { CoreModule } from '../core/core.module';
import { AdminRoutingModule } from './admin-routing.module';

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

@NgModule({
  declarations: [
    DashboardComponent,
    TrashComponent,
    UsersComponent,
    UserComponent,
    ProfileComponent,
    SlidesComponent,
    SlideComponent,
    PagesComponent,
    PageComponent,
    MenuComponent,
    MenusComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    MaterialModule,
    CovalentModule,
    LayoutAdminModule,
    CoreModule,
    AdminRoutingModule
  ]
})
export class AdminModule {}
