import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ActivationEnd } from '@angular/router';
import { first } from 'rxjs/operators';

import { FileService } from '../../../core/files/services/file.service';

import { File } from '../../../core/files/models/file';

@Component({
  selector: 'app-file',
  templateUrl: './file.component.html',
  styleUrls: ['./file.component.scss']
})
export class FileComponent implements OnInit {
  file: File;
  filter: string;
  value: string;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private fileService: FileService
  ) {
    this.router.events.subscribe((data) => {
      if (data instanceof ActivationEnd) {
        if (!!data.snapshot.params.filter) {
          this.filter = data.snapshot.params.filter;
        }
        if (!!data.snapshot.params.value) {
          this.value = data.snapshot.params.value;
        }
      }
    });
  }

  ngOnInit() {
    const value = this.route.snapshot.paramMap.get('value');

    if (value) {
      this.value = value;

      this.fileService
        .getItem(value)
        .subscribe((file: File) => (this.file = file))
        .unsubscribe();
    } else {
      this.route.paramMap
        .subscribe((params) => {
          if (params.get('value')) {
            this.value = params.get('value');

            this.fileService
              .getItem(value)
              .pipe(first())
              .subscribe((file: File) => (this.file = file));
          }
        })
        .unsubscribe();
    }

    const filter = this.route.snapshot.paramMap.get('filter');
    console.log('¡?==?=?=?', filter);

    if (filter) {
      this.filter = filter;
    } else {
      this.filter = 'add';

      this.route.paramMap
        .subscribe((params) => {
          if (params.get('filter')) {
            this.filter = params.get('filter');
          }
        })
        .unsubscribe();
    }
  }
}
