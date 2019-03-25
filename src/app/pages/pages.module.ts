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

import {
  PagesComponent,
  PageComponent,
  PageViewComponent
} from './layout-content';
import {
  PageListComponent,
  PageFormComponent,
  PageInfoComponent
} from './components';

@NgModule({
  declarations: [
    PagesComponent,
    PageListComponent,
    PageFormComponent,
    PageComponent,
    PageInfoComponent,
    PageViewComponent
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
    SharedModule
  ],
  exports: []
})
export class PagesModule {}
