import { Component, OnInit, Input } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { StoreService } from 'ng-barn';
import * as _ from 'lodash';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import * as _moment from 'moment';
import { Observable } from 'rxjs';

declare var $: any;

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
  @Input() uid: string;

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
    store.select('menus');
  }

  get f(): any {
    return this.form.controls;
  }

  ngOnInit() {
    this.menus = this.menuService.list();

    this.errorMessages = {
      image: {
        required: 'La foto de perfíl es requerida.'
      }
    };

    this.form = new FormGroup({
      uid: new FormControl(),
      index: new FormControl(),
      text: new FormControl('', Validators.required),
      redirect: new FormControl('', Validators.required),
      blocked: new FormControl(true),
      deleted: new FormControl(false)
    });

    if (this.uid) {
      this.menuService
        .filter({ uid: this.uid })
        .subscribe((menus: Menu[]) => {
          if (menus && menus.length > 0 && menus.length === 1) {
            const menu: Menu = menus[0];

            this.form.patchValue({
              uid: menu.uid,
              index: menu.index,
              text: menu.text,
              redirect: menu.redirect,
              blocked: menu.blocked,
              deleted: menu.deleted
            });
          }
        })
        .unsubscribe();
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

    const value = event[event.index];

    console.log(this.uid, value);
    if (this.uid) {
      this.menuService
        .set({ uid: this.uid }, new Menu(value))
        .subscribe((menuResponse: MenuServiceResponse) => {
          if (menuResponse) {
            this.message = {
              show: true,
              label: 'Info',
              sublabel: 'Menu editado',
              color: 'accent',
              icon: 'info'
            };

            this.router.navigate(['/admin/menu/list']);
          }
        })
        .unsubscribe();
    } else {
      value.index = event.index;

      this.menuService
        .push(new Menu(value))
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
  }
  onSubmitted(event: boolean) {
    this.submitted = true;

    if (event) {
      this.submitted = false;
      this.reset();
    } else {
      this.submitted = false;
    }
  }
}
