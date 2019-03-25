import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MaterialModule } from '../../material.module';
import { CovalentModule } from '../../covalent.module';

import { LayoutAdminComponent } from './layout-admin/layout-admin.component';

@NgModule({
  declarations: [LayoutAdminComponent],
  imports: [CommonModule, RouterModule, MaterialModule, CovalentModule],
  exports: [LayoutAdminComponent]
})
export class LayoutAdminModule {}
