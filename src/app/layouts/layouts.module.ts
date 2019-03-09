import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LayoutDefaultComponent } from './layout-default/layout-default.component';

@NgModule({
  declarations: [LayoutDefaultComponent],
  imports: [
    CommonModule
  ],
  exports: [LayoutDefaultComponent]
})
export class LayoutsModule { }
