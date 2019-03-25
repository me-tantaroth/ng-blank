import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SlidesRoutingModule } from './slides-routing.module';
import { SlidesComponent } from './layout-content/slides/slides.component';
import { SlideComponent } from './layout-content/slide/slide.component';

@NgModule({
  declarations: [SlidesComponent, SlideComponent],
  imports: [
    CommonModule,
    SlidesRoutingModule
  ]
})
export class SlidesModule { }
