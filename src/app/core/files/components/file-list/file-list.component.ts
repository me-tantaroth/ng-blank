import { Component, OnInit, Input } from '@angular/core';
import { Router, ActivationEnd } from '@angular/router';
import { Observable, of } from 'rxjs';
import * as _ from 'lodash';

import {
  FileService,
  ServiceResponse as FileServiceResponse
} from '../../services/file.service';

import { File } from '../../models/file';

@Component({
  selector: 'app-file-list',
  templateUrl: './file-list.component.html',
  styleUrls: ['./file-list.component.scss']
})
export class FileListComponent implements OnInit {
  @Input() filter: string;
  @Input() value: string;

  currentFile: File;
  fileList: Observable<File[]>;
  backFile: Observable<File[]>;

  constructor(private fileService: FileService, private router: Router) {
    router.events.subscribe((data) => {
      if (data instanceof ActivationEnd) {
        if (
          !!data.snapshot.params.filter &&
          data.snapshot.params.filter === 'path' &&
          !!data.snapshot.params.value
        ) {
          this.filter = data.snapshot.params.filter;
          this.value = data.snapshot.params.value;

          this.fileService
            .itemWithPath(this.value)
            .subscribe((file) => {
              console.log('## File', file);
              this.currentFile = file;
              this.fileList = of(file.file);
            })
            .unsubscribe();
        }
      }
    });
  }

  ngOnInit() {
    if (!!this.filter && this.filter === 'path' && !!this.value) {
      console.log('## FILTER PATH');
      this.fileService
        .itemWithPath(this.value)
        .subscribe((file) => {
          console.log('## FILE', file);
          this.currentFile = file;
        })
        .unsubscribe();
      this.fileList = this.fileService.filterWithPath(this.value, {
        deleted: false
      });
    } else if (!!this.filter && this.filter === 'deleted') {
      console.log('## FILTER DELETED');

      if (!!this.value) {
        this.fileList = this.fileService.listWithPath(this.value);
      } else {
        this.fileList = this.fileService.list();
      }
    } else {
      this.filter = 'path';

      console.log('## ONLY NOT DELETED');
      this.fileList = this.fileService.filter({
        deleted: false
      });
    }
  }

  onAddFile(type, file: File) {
    if (file) {
      if (!!this.filter && this.filter === 'path' && !!this.value) {
        this.router.navigate(['/admin/file/form/add-' + type, this.value]);
      } else {
        this.router.navigate(['/admin/file/form/add-' + type]);
      }
    } else {
      this.router.navigate(['/admin/file/form/add-' + type]);
    }
  }

  onBackFile(file: File) {
    if (file) {
      if (file.root) {
        this.router.navigate(['/admin/file/list/' + (this.filter || '')]);
      } else {
        this.router.navigate([
          '/admin/file/list/' + (this.filter || ''),
          file.backPath || ''
        ]);
      }
    }
  }

  onBlockFile(file: File) {
    file.blocked = true;

    this.fileService
      .setWithPath(file.path, file)
      .subscribe((response: FileServiceResponse) => {
        if (response && response.list) {
          this.fileList = of(response.list);
        }
      })
      .unsubscribe();
  }

  onDeleteFile(file: File) {
    file.deleted = true;

    this.fileService
      .setWithPath(file.path, file)
      .subscribe((response: FileServiceResponse) => {
        if (response && response.list) {
          this.fileList = of(response.list);
        }
      })
      .unsubscribe();
  }
}