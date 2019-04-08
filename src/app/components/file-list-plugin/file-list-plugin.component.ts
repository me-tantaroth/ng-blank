import { Component, OnInit, Input } from '@angular/core';
import { Router, ActivationEnd } from '@angular/router';
import { Observable, of } from 'rxjs';
import * as _ from 'lodash';

import {
  FileService
} from '../../core/files/services/file.service';

import { File } from '../../core/files/models/file';

@Component({
  selector: 'app-file-list-plugin',
  templateUrl: './file-list-plugin.component.html',
  styleUrls: ['./file-list-plugin.component.scss']
})
export class FileListPluginComponent implements OnInit {
  @Input() filter: string;
  @Input() value: string;

  currentFile: File;
  fileList: Observable<File[]>;
  backFile: Observable<File[]>;

  constructor(private fileService: FileService, private router: Router) {
    // router.events.subscribe((data) => {
    //   if (data instanceof ActivationEnd) {
    //     if (
    //       !!data.snapshot.params.filter &&
    //       data.snapshot.params.filter === 'path' &&
    //       !!data.snapshot.params.value
    //     ) {
    //       this.filter = data.snapshot.params.filter;
    //       this.value = data.snapshot.params.value;

    //       this.fileService
    //         .itemWithPath(this.value)
    //         .subscribe((file) => {
    //           console.log('## File', file);
    //           this.currentFile = file;
    //           this.fileList = of(file.file);
    //         })
    //         .unsubscribe();
    //     }
    //   }
    // });
  }

  ngOnInit() {
    // if (!!this.filter && this.filter === 'path' && !!this.value) {
    //   console.log('## FILTER PATH');
    //   this.fileService
    //     .itemWithPath(this.value)
    //     .subscribe((file) => {
    //       console.log('## FILE', file);
    //       this.currentFile = file;
    //     })
    //     .unsubscribe();
    //   this.fileList = this.fileService.filterWithPath(this.value, {
    //     deleted: false
    //   });
    // } else if (!!this.filter && this.filter === 'deleted') {
    //   console.log('## FILTER DELETED');

    //   if (!!this.value) {
    //     this.fileList = this.fileService.listWithPath(this.value);
    //   } else {
    //     this.fileList = this.fileService.list();
    //   }
    // } else {
    //   this.filter = 'path';

    //   console.log('## ONLY NOT DELETED');
    //   this.fileList = this.fileService.filter({
    //     deleted: false
    //   });
    // }
  }

  onBackFile(file: File) {
    if (file) {
      if (file.root) {
        this.router.navigate(['/files/' + (this.filter || '')]);
      } else {
        this.router.navigate([
          '/files/' + (this.filter || ''),
          file.backPath || ''
        ]);
      }
    }
  }
}

