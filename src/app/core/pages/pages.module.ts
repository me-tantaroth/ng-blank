import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgBarnModule } from 'ng-barn';
import { FroalaEditorModule, FroalaViewModule } from 'angular-froala-wysiwyg';
import { MaterialModule } from '../../material.module';
import { CovalentModule } from '../../covalent.module';
import { LayoutAdminModule } from '../../admin/layout-admin/layout-admin.module';
import { SharedModule } from '../../shared/shared.module';

import {
  PageListComponent,
  PageFormComponent,
  PageInfoComponent
} from './components';

@NgModule({
  declarations: [
    PageListComponent,
    PageFormComponent,
    PageInfoComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    NgBarnModule,
    FroalaEditorModule.forRoot(),
    FroalaViewModule.forRoot(),
    MaterialModule,
    CovalentModule,
    LayoutAdminModule,
    SharedModule
  ],
  exports: [PageListComponent, PageFormComponent, PageInfoComponent]
})
export class PagesModule {}
