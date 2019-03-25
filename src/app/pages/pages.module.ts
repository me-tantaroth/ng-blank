import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgBarnModule } from 'ng-barn';
import { FroalaEditorModule, FroalaViewModule } from 'angular-froala-wysiwyg';
import { PagesRoutingModule } from './pages-routing.module';
import { MaterialModule } from '../material.module';
import { CovalentModule } from '../covalent.module';
import { LayoutsModule } from '../layouts/layouts.module';
import { SharedModule } from '../shared/shared.module';
import { UsersModule } from '../users/users.module';

import {
  PagesComponent,
  PageComponent,
  ViewContentComponent
} from './layout-content';
import {
  PageListComponent,
  PageFormComponent,
  ModalPageListComponent,
  PageDetailComponent
} from './components';

@NgModule({
  declarations: [
    PagesComponent,
    PageListComponent,
    PageFormComponent,
    PageComponent,
    ModalPageListComponent,
    ViewContentComponent,
    PageDetailComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgBarnModule,
    FroalaEditorModule.forRoot(),
    FroalaViewModule.forRoot(),
    MaterialModule,
    CovalentModule,
    LayoutsModule,
    PagesRoutingModule,
    SharedModule,
    UsersModule
  ],
  exports: [PageListComponent, PageFormComponent, ModalPageListComponent]
})
export class PagesModule {}
