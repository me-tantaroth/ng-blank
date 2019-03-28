import { Component, OnInit, Input } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { StoreService } from 'ng-barn';
import * as _ from 'lodash';
import * as _moment from 'moment';
import { Observable } from 'rxjs';

import {
  MenuService,
  ServiceResponse as MenuServiceResponse
} from '../../services/menu.service';

import { Menu } from '../../models/menu';
import { Message } from '../../../../models/message';

@Component({
  selector: 'app-menu-form',
  templateUrl: './menu-form.component.html',
  styleUrls: ['./menu-form.component.scss']
})
export class MenuFormComponent implements OnInit {
  @Input() menu: Menu;
  @Input() action: string;
  @Input() path: string;

  events: string[] = [];
  menus: Observable<Menu[]>;
  submitted: boolean;
  form: FormGroup;
  editing: boolean;
  message: Message = {
    show: false
  };
  errorMessages: any;

  constructor(
    private store: StoreService,
    private menuService: MenuService,
    private router: Router
  ) {
    store.select('menu');
  }

  get f(): any {
    return this.form.controls;
  }

  ngOnInit() {
    this.errorMessages = {
      image: {
        required: 'La foto de perfíl es requerida.'
      }
    };

    this.form = new FormGroup({
      text: new FormControl('', Validators.required),
      link: new FormControl('', Validators.required),
      blocked: new FormControl(true),
      deleted: new FormControl(false)
    });

    if (this.action === 'edit') {
      this.form.patchValue(this.menu);
    }
  }

  reset() {
    this.form.reset();
  }

  errors(controlField: string) {
    return Object.keys(this.f[controlField].errors);
  }

  onSubmitting(event: any) {
    this.message = {
      show: false
    };

    const value = new Menu(event[event.index]);

    if (this.action === 'add') {
      if (this.path && this.menu) {
        value.path = this.path + '|menu|' + this.menu.menu.length;
        value.backPath = this.path;

        this.menuService
          .pushWithPath(this.path, value)
          .subscribe((menuResponse: MenuServiceResponse) => {
            if (menuResponse) {
              this.message = {
                show: true,
                label: 'Info',
                sublabel: 'Menu creado',
                color: 'accent',
                icon: 'info'
              };
            }

            this.router.navigate(['/admin/menu/list/path', this.path]);
          })
          .unsubscribe();
      } else {
        this.menuService
          .list()
          .subscribe((menuList: Menu[]) => {
            if (!!menuList) {
              value.root = true;
              value.path = '|' + menuList.length;

              this.menuService
                .push(value)
                .subscribe((menuResponse: MenuServiceResponse) => {
                  if (menuResponse) {
                    this.message = {
                      show: true,
                      label: 'Info',
                      sublabel: 'Menu creado',
                      color: 'accent',
                      icon: 'info'
                    };
                  }

                  this.router.navigate(['/admin/menu/list']);
                })
                .unsubscribe();
            }
          })
          .unsubscribe();
      }
    } else if (this.action === 'edit') {
      if (this.path && this.menu) {
        this.menu.text = value.text;
        this.menu.link = value.link;
        this.menu.blocked = value.blocked;
        this.menu.deleted = value.deleted;

        this.menuService
          .setWithPath(this.path, this.menu)
          .subscribe((menuResponse: MenuServiceResponse) => {
            if (menuResponse) {
              this.message = {
                show: true,
                label: 'Info',
                sublabel: 'Menu editado',
                color: 'accent',
                icon: 'info'
              };
            }

            if (this.menu.root) {
              this.router.navigate(['/admin/menu/list']);
            } else {
              this.router.navigate([
                '/admin/menu/list/path',
                this.menu.backPath
              ]);
            }
          })
          .unsubscribe();
      }
    }
  }
  onSubmitted(event: boolean) {
    console.log('SUBMIT', event);
    this.submitted = true;

    if (event) {
      this.submitted = false;
      this.reset();
    } else {
      this.submitted = false;
    }
  }
}
