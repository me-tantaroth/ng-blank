import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../material.module';
import { AuthModule } from '../auth/auth.module';

import { UkModalComponent } from './components/uk-modal/uk-modal.component';

@NgModule({
  declarations: [UkModalComponent],
  imports: [
    CommonModule,
    MaterialModule,
    AuthModule
  ],
  exports: [UkModalComponent]
})
export class SharedModule { }
