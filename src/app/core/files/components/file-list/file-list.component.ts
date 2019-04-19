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
  files: Observable<File[]>;
  backfile: Observable<File[]>;

  constructor(private fileService: FileService, private router: Router) {
    router.events.subscribe((data) => {
      if (data instanceof ActivationEnd) {
        if (!!data.snapshot.params.filter && !!data.snapshot.params.value) {
          this.filter = data.snapshot.params.filter;
          this.value = data.snapshot.params.value;
          const currentFile = data.snapshot.params.value.split('|');

          currentFile.pop();

          switch (data.snapshot.params.filter) {
            case 'list':
              if (currentFile.join('|') !== '') {
                this.currentFile = this.fileService.getItem(
                  currentFile.join('|')
                );
              }
              this.files = this.fileService.list(data.snapshot.params.value);
              break;
          }
        }
      }
    });
  }

  ngOnInit() {
    if (!!this.filter && !!this.value) {
      const currentFile = this.value.split('|');

      currentFile.pop();

      switch (this.filter) {
        case 'list':
          if (currentFile.join('|') !== '') {
            this.currentFile = this.fileService.getItem(currentFile.join('|'));
          }
          this.files = this.fileService.list(this.value);
          break;
      }
    } else {
      this.filter = 'list';
      this.files = this.fileService.list('|' + this.filter);
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
        '/admin/file/enabled/' + file.backPath,
        file.backPath || ''
      ]);
    }
  }

  onBlockFile(path: string, file: File) {
    const splitPath = path.split('|');
    splitPath.shift();
    splitPath.shift();

    file.blocked = true;

    // this.fileService
    //   .setItem('|blocked|' + splitPath.join('|'), file)
    //   .pipe(first())
    //   .subscribe((status: FileServiceResponse) => {
    //     if (status) {
    //       this.fileService
    //         .removeItem('|enabled|' + splitPath.join('|'))
    //         .pipe(first())
    //         .subscribe((statusEnabled: boolean) => {
    //           if (statusEnabled) {
    //             this.onBackFile(file);
    //           }
    //         });
    //     }
    //   });
  }

  onUnBlockFile(path: string, file: File) {
    file.blocked = false;

    // this.fileService
    //   .setItem(path, file)
    //   .pipe(first())
    //   .subscribe((status: FileServiceResponse) => {
    //     if (status) {
    //       this.fileService
    //         .removeItem('|blocked|' + file.uid)
    //         .pipe(first())
    //         .subscribe((statusRemoved: boolean) => {
    //           if (statusRemoved) {
    //             this.onBackFile(file);
    //           }
    //         });
    //     }
    //   });
  }

  onDeleteFile(file: File) {
    if (confirm(`Seguro que desea eliminar a '${file.text}'?`)) {
      file.deleted = true;

      const path = file.customPath.split('|');

      path.pop();

      this.fileService
        .removeItem(path.join('|'))
        .pipe(first())
        .subscribe(() => {
          if (status) {
            this.fileService
              .removeItem('|enabled|' + file.uuid)
              .pipe(first())
              .subscribe();
          }
        });
    }
  }

  onUnDeletedFile(path: string, file: File) {
    file.deleted = false;

    // this.fileService
    //   .setItem(path, file)
    //   .pipe(first())
    //   .subscribe((status: FileServiceResponse) => {
    //     if (status) {
    //       this.fileService
    //         .removeItem('|deleted|' + file.uid)
    //         .pipe(first())
    //         .subscribe((statusDeleted: boolean) => {
    //           if (statusDeleted) {
    //             this.files = this.fileService.list('|deleted');
    //           }
    //         });
    //     }
    //   });
  }
}
