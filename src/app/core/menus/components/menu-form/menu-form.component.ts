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
  @Input() id: string;

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
      text: new FormControl('', Validators.required),
      redirect: new FormControl('', Validators.required),
      blocked: new FormControl(true),
      deleted: new FormControl(false)
    });

    if (this.id) {
      this.menuService
        .get(this.id)
        .subscribe((menuResponse: MenuServiceResponse) => {
          if (menuResponse) {
            const menu: Menu = menuResponse.value;

            this.form.patchValue({
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

    if (this.id) {
      this.menuService
        .set(this.id, new Menu(value))
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
