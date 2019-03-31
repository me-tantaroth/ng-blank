import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs/operators';

import { FileService } from '../../../core/files/services/file.service';

import { File } from '../../../core/files/models/file';

@Component({
  selector: 'app-file',
  templateUrl: './file.component.html',
  styleUrls: ['./file.component.scss']
})
export class FileComponent implements OnInit {
  file: File;
  path: string;
  action: string;

  constructor(
    private route: ActivatedRoute,
    private fileService: FileService
  ) {}

  ngOnInit() {
    const path = this.route.snapshot.paramMap.get('path');

    console.log('>>>>>>>>>> path', path)
    if (path) {
      this.path = path;

      this.fileService
        .itemWithPath(path)
        .subscribe((file: File) => (this.file = file))
        .unsubscribe();
    } else {
      this.route.paramMap
        .subscribe((params) => {
          const path = params.get('path');

          if (path) {
            this.path = path;

            this.fileService
              .itemWithPath(path)
              .pipe(
                map(
                  o => {
                    console.log(o);

                    return o;
                  }
                )
              )
              .subscribe((file: File) => {
                console.log('>>>>>> file', file);
                return this.file = file;})
              .unsubscribe();
          }
        })
        .unsubscribe();
    }

    const action = this.route.snapshot.paramMap.get('action');

    console.log('>>>>>>>>>> action', action)
    if (action) {
      this.action = action;
    } else {
      this.action = 'add';

      this.route.paramMap
        .subscribe((params) => {
          const action = params.get('action');

          if (action) {
            this.action = action;
          }
        })
        .unsubscribe();
    }
  }
}
