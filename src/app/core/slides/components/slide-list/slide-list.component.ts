import { Component, OnInit, Input } from '@angular/core';
import { Router, ActivationEnd } from '@angular/router';
import { Observable, combineLatest } from 'rxjs';
import { first } from 'rxjs/operators';
import * as _ from 'lodash';
import { StoreService } from 'ng-barn';

import { ModulesService } from '../../../modules/services/modules.service';
import { UsersService } from '../../../users/services/users.service';
import { SlideService } from '../../services/slide.service';

import { Module } from 'src/app/core/modules/models/module';
import { User } from 'src/app/core/users/models/user';
import { Slide } from '../../models/slide';

@Component({
  selector: 'app-slide-list',
  templateUrl: './slide-list.component.html',
  styleUrls: ['./slide-list.component.scss']
})
export class SlideListComponent implements OnInit {
  @Input() filter: string;
  @Input() value: string;

  ObjectKeys = Object.keys;
  panelOpenState: boolean;
  currentSlide: Observable<Slide>;
  slides: Observable<Slide[]>;
  backSlide: Observable<Slide[]>;

  constructor(
    private store: StoreService,
    private modulesService: ModulesService,
    private usersService: UsersService,
    private slideService: SlideService,
    private router: Router
  ) {
    router.events.subscribe((data) => {
      if (data instanceof ActivationEnd) {
        if (!!data.snapshot.params.filter && !!data.snapshot.params.value) {
          this.filter = data.snapshot.params.filter;
          this.value = data.snapshot.params.value;
          const currentSlide = data.snapshot.params.value.split('|');

          currentSlide.pop();

          switch (data.snapshot.params.filter) {
            case 'list':
              if (currentSlide.join('|') !== '') {
                this.currentSlide = this.slideService.getItem(
                  currentSlide.join('|')
                );
              }
              this.slides = this.slideService.list(data.snapshot.params.value);
              break;
          }
        }
      }
    });
  }

  ngOnInit() {
    if (!!this.filter && !!this.value) {
      const currentSlide = this.value.split('|');

      currentSlide.pop();

      switch (this.filter) {
        case 'list':
          if (currentSlide.join('|') !== '') {
            this.currentSlide = this.slideService.getItem(
              currentSlide.join('|')
            );
          }
          this.slides = this.slideService.list(this.value);
          break;
      }
    } else {
      this.filter = 'list';
      this.slides = this.slideService.list('|' + this.filter);
    }
  }

  onBlockSlide(path: string, slide: Slide) {
    slide.blocked = true;

    // this.slideService
    //   .setItem(path, slide)
    //   .pipe(first())
    //   .subscribe((status: boolean) => {
    //     if (status) {
    //       this.slideService
    //         .removeItem('|enabled|' + slide.uid)
    //         .pipe(first())
    //         .subscribe((statusEnabled: boolean) => {
    //           if (statusEnabled) {
    //             this.slides = this.slideService.list('|enabled');
    //           }
    //         });
    //     }
    //   });
  }

  onUnBlockSlide(path: string, slide: Slide) {
    slide.blocked = false;

    // this.slideService
    //   .setItem(path, slide)
    //   .pipe(first())
    //   .subscribe((status: boolean) => {
    //     if (status) {
    //       this.slideService
    //         .removeItem('|blocked|' + slide.uid)
    //         .pipe(first())
    //         .subscribe((statusRemoved: boolean) => {
    //           if (statusRemoved) {
    //             this.slides = this.slideService.list('|blocked');
    //           }
    //         });
    //     }
    //   });
  }

  onDeleteSlide(slide: Slide) {
    const slideModule$: Observable<Module> = this.modulesService.getItem(
      '|slide'
    );
    const currentUser$: Observable<User> = this.usersService.getItem(
      this.store.get('currentUserPermissions').path
    );

    if (confirm(`Seguro que desea eliminar a '${slide.text}'?`)) {
      combineLatest([slideModule$, currentUser$])
        .pipe(first())
        .subscribe(([slideModule, currentUser]) => {
          if (currentUser.permissions.slide_delete) {
            slideModule.count = slideModule.count - 1;

            this.modulesService
              .setItem('|slide', slideModule)
              .pipe(first())
              .subscribe(() => {
                slide.deleted = true;

                const path = slide.customPath.split('|');

                path.pop();

                this.slideService
                  .removeItem(path.join('|'))
                  .pipe(first())
                  .subscribe(() => {
                    if (status) {
                      this.slideService
                        .removeItem('|enabled|' + slide.uuid)
                        .pipe(first())
                        .subscribe();
                    }
                  });
              });
          } else {
            alert('Error!: Su plan no le permite hacer esta acción!');
          }
        });
    }
  }

  onUnDeletedSlide(path: string, slide: Slide) {
    slide.deleted = false;

    // this.slideService
    //   .setItem(path, slide)
    //   .pipe(first())
    //   .subscribe((status: boolean) => {
    //     if (status) {
    //       this.slideService
    //         .removeItem('|deleted|' + slide.uid)
    //         .pipe(first())
    //         .subscribe((statusDeleted: boolean) => {
    //           if (statusDeleted) {
    //             this.slides = this.slideService.list('|deleted');
    //           }
    //         });
    //     }
    //   });
  }
}
