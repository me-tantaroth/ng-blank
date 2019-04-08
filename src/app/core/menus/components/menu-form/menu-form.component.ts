import { Component, OnInit, Input } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { StoreService } from 'ng-barn';
import * as _ from 'lodash';
import * as _moment from 'moment';
import { Observable } from 'rxjs';

import { MenuService } from '../../services/menu.service';

import { Menu, Menus } from '../../models/menu';
import { Message } from '../../../../models/message';

@Component({
  selector: 'app-menu-form',
  templateUrl: './menu-form.component.html',
  styleUrls: ['./menu-form.component.scss']
})
export class MenuFormComponent implements OnInit {
  @Input() menu: Menu;
  @Input() filter: string;
  @Input() value: string;

  menus: Observable<Menus>;
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
      uid: new FormControl(),
      title: new FormControl('', Validators.required),
      url: new FormControl('', Validators.required),
      currentPath: new FormControl(''),
      dbPath: new FormControl(''),
      externalURL: new FormControl(false),
      blocked: new FormControl(true),
      deleted: new FormControl(false)
    });
    if (this.filter === 'edit') {
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

    const value = event[event.index];
    const menu: Menu = new Menu(value);

    if (this.filter === 'edit') {
      menu.dbPath = this.value + '|enabled';
      menu.currentPath = this.value + '|enabled|' + menu.uid;
      menu.backPath = this.value;
      menu.root = true;

      this.menuService
        .setItem(this.value, menu)
        .subscribe((status: boolean) => {
          if (status) {
            this.message = {
              show: true,
              label: 'Info',
              sublabel: 'Menú guardado',
              color: 'accent',
              icon: 'info'
            };

            this.router.navigate(['/admin/menu/list']);
          }
        })
        .unsubscribe();
    } else if (this.filter === 'add') {
      if (this.value) {
        menu.dbPath = this.value + '|enabled';
        menu.currentPath = this.value + '|enabled|' + menu.uid;
        menu.backPath = this.value;
        menu.root = true;

        this.menuService
          .setItem(this.value + '|enabled|' + menu.uid, menu)
          .subscribe((status: boolean) => {
            if (status) {
              this.message = {
                show: true,
                label: 'Info',
                sublabel: 'Menú guardado',
                color: 'accent',
                icon: 'info'
              };

              this.router.navigate(['/admin/menu/list']);
            }
          })
          .unsubscribe();
      } else {
        menu.dbPath = '|enabled';
        menu.currentPath = '|enabled|' + menu.uid;
        menu.backPath = '';
        menu.root = true;

        this.menuService
          .setItem('|enabled|' + menu.uid, menu)
          .subscribe((status: boolean) => {
            if (status) {
              this.message = {
                show: true,
                label: 'Info',
                sublabel: 'Menú guardado',
                color: 'accent',
                icon: 'info'
              };

              this.router.navigate(['/admin/menu/list']);
            }
          })
          .unsubscribe();
      }
    } else {
      menu.dbPath = '|enabled';
      menu.currentPath = '|enabled|' + menu.uid;
      menu.backPath = '';
      menu.root = true;

      this.menuService
        .setItem('|enabled|' + menu.uid, menu)
        .subscribe((status: boolean) => {
          if (status) {
            this.message = {
              show: true,
              label: 'Info',
              sublabel: 'Menú guardado',
              color: 'accent',
              icon: 'info'
            };

            this.router.navigate(['/admin/menu/list']);
          }
        })
        .unsubscribe();
    }

    this.reset();
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
