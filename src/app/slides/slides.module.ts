import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgBarnModule } from 'ng-barn';
import { MaterialModule } from '../material.module';
import { CovalentModule } from '../covalent.module';
import { LayoutsModule } from '../layouts/layouts.module';
import { SharedModule } from '../shared/shared.module';

import { SlidesRoutingModule } from './slides-routing.module';
import { SlidesComponent, SlideComponent } from './layout-content';
import { SlideListComponent, SlideFormComponent } from './components';

@NgModule({
  declarations: [
    SlidesComponent,
    SlideComponent,
    SlideListComponent,
    SlideFormComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgBarnModule,
    SlidesRoutingModule,
    MaterialModule,
    CovalentModule,
    LayoutsModule,
    SharedModule
  ]
})
export class SlidesModule {}
