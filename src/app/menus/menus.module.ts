import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgBarnModule } from 'ng-barn';
import { MaterialModule } from '../material.module';
import { CovalentModule } from '../covalent.module';
import { LayoutsModule } from '../layouts/layouts.module';
import { SharedModule } from '../shared/shared.module';

import { MenusRoutingModule } from './menus-routing.module';
import { MenusComponent, MenuComponent } from './layout-content';
import { MenuListComponent, MenuFormComponent } from './components';

@NgModule({
  declarations: [
    MenusComponent,
    MenuComponent,
    MenuListComponent,
    MenuFormComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgBarnModule,
    MenusRoutingModule,
    MaterialModule,
    CovalentModule,
    LayoutsModule,
    SharedModule
  ]
})
export class MenusModule {}
