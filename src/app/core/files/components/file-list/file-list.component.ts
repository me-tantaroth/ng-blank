import { Component, OnInit, Input } from '@angular/core';
import { Router, ActivationEnd } from '@angular/router';
import { Observable } from 'rxjs';
import { first } from 'rxjs/operators';
import * as _ from 'lodash';

import { FileService } from '../../services/file.service';

import { File, Files } from '../../models/file';

@Component({
  selector: 'app-file-list',
  templateUrl: './file-list.component.html',
  styleUrls: ['./file-list.component.scss']
})
export class FileListComponent implements OnInit {
  @Input() filter: string;
  @Input() value: string;

  ObjectKeys = Object.keys;
  panelOpenState: boolean;
  currentFile: Observable<File>;
  files: Observable<Files>;
  backfile: Observable<Files>;

  constructor(private fileService: FileService, private router: Router) {
    router.events.subscribe((data) => {
      if (data instanceof ActivationEnd) {
        if (
          !!data.snapshot.params.filter &&
          data.snapshot.params.filter === 'enabled' &&
          !!data.snapshot.params.value
        ) {
          this.currentFile = this.fileService.getItem(
            data.snapshot.params.value
          );
          this.files = this.fileService.list(
            data.snapshot.params.value + '|enabled'
          );
        } else {
          if (
            !!data.snapshot.params.filter &&
            (data.snapshot.params.filter === 'enabled' ||
              data.snapshot.params.filter === 'blocked' ||
              data.snapshot.params.filter === 'deleted') &&
            !data.snapshot.params.value
          ) {
            console.log('¡?¡¡¡¡¡¡¡¡', data.snapshot.params.filter);
            this.files = this.fileService.list(
              '|' + data.snapshot.params.filter
            );
          }
        }
      }
    });
  }

  ngOnInit() {
    if (!!this.filter && this.filter === 'enabled' && !!this.value) {
      console.log('## FILTER PATH');
      this.currentFile = this.fileService.getItem(this.value);

      this.files = this.fileService.list(this.value + '|enabled');
    } else {
      this.filter = this.filter || 'enabled';

      console.log('## ONLY NOT DELETED');
      this.files = this.fileService.list('|' + this.filter);
      this.files.subscribe((data) => console.log('QQQQ', data));
    }
  }

  onAddFile(file: File) {
    if (file) {
      if (!!this.filter && this.filter === 'path' && !!this.value) {
        this.router.navigate(['/admin/file/form/add', this.value]);
      } else {
        this.router.navigate(['/admin/file/form/add']);
      }
    } else {
      this.router.navigate(['/admin/file/form/add']);
    }
  }

  onBackFile(file: File) {
    if (file) {
      this.router.navigate([
        '/admin/file/list/' + (this.filter || 'enabled'),
        file.backPath || ''
      ]);
    }
  }

  onBlockFile(path: string, file: File) {
    const splitPath = path.split('|');
    splitPath.shift();
    splitPath.shift();

    file.blocked = true;

    console.log('## BLOCKED', path, file, '|blocked|' + splitPath.join('|'));

    this.fileService
      .setItem('|blocked|' + splitPath.join('|'), file)
      .pipe(first())
      .subscribe((status: boolean) => {
        if (status) {
          this.fileService
            .removeItem('|enabled|' + splitPath.join('|'))
            .pipe(first())
            .subscribe((statusEnabled: boolean) => {
              if (statusEnabled) {
                this.onBackFile(file);
              }
            });
        }
      });
  }

  onUnBlockFile(path: string, file: File) {
    file.blocked = false;

    this.fileService
      .setItem(path, file)
      .pipe(first())
      .subscribe((status: boolean) => {
        if (status) {
          this.fileService
            .removeItem('|blocked|' + file.uid)
            .pipe(first())
            .subscribe((statusRemoved: boolean) => {
              if (statusRemoved) {
                this.onBackFile(file);
              }
            });
        }
      });
  }

  onDeleteFile(path: string, file: File) {
    if (confirm(`Seguro que desea eliminar a '${file.title}'?`)) {
      file.deleted = true;

      this.fileService
        .setItem(path, file)
        .pipe(first())
        .subscribe((status: boolean) => {
          if (status) {
            this.fileService
              .removeItem('|enabled|' + file.uid)
              .pipe(first())
              .subscribe((statusEnabled: boolean) => {
                if (statusEnabled) {
                  this.files = this.fileService.list('|enabled');
                }
              });
          }
        });
    }
  }

  onUnDeletedFile(path: string, file: File) {
    file.deleted = false;

    this.fileService
      .setItem(path, file)
      .pipe(first())
      .subscribe((status: boolean) => {
        if (status) {
          this.fileService
            .removeItem('|deleted|' + file.uid)
            .pipe(first())
            .subscribe((statusDeleted: boolean) => {
              if (statusDeleted) {
                this.files = this.fileService.list('|deleted');
              }
            });
        }
      });
  }
}
