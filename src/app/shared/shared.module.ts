import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FileUploadComponent } from './components';
import { FileDragDropDirective } from './directives';
import { SafePipe } from './pipes/safe.pipe';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [FileUploadComponent, FileDragDropDirective, SafePipe],
  exports: [FileUploadComponent, FileDragDropDirective, SafePipe]
})
export class SharedModule { }
