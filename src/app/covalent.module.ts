import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CovalentMessageModule } from '@covalent/core/message';

@NgModule({
  declarations: [],
  imports: [CommonModule, CovalentMessageModule],
  exports: [CovalentMessageModule]
})
export class CovalentModule {}
