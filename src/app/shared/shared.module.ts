import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FileUploadComponent } from './components';
import { FileDragDropDirective } from './directives';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [FileUploadComponent, FileDragDropDirective],
  exports: [FileUploadComponent, FileDragDropDirective]
})
export class SharedModule { }
