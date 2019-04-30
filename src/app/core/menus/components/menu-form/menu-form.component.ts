import {
  Component,
  OnInit,
  OnChanges,
  SimpleChanges,
  Input
} from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { StoreService } from 'ng-barn';
import * as _ from 'lodash';
import * as _moment from 'moment';
import { Observable, combineLatest } from 'rxjs';
import { first } from 'rxjs/operators';

import { ModulesService } from '../../../modules/services/modules.service';
import { UserService } from '../../../users/services/user.service';
import { MenuService } from '../../services/menu.service';

import { Menu } from '../../models/menu';
import { Message } from '../../../../models/message';
import { Module } from 'src/app/core/modules/models/module';
import { User } from 'src/app/core/users/models/user';

@Component({
  selector: 'app-menu-form',
  templateUrl: './menu-form.component.html',
  styleUrls: ['./menu-form.component.scss']
})
export class MenuFormComponent implements OnInit, OnChanges {
  @Input() menu: Menu;
  @Input() filter: string;
  @Input() value: string;

  uuid: string;
  ref: string;
  menus: Observable<Menu[]>;
  submitted: boolean;
  form: FormGroup;
  editing: boolean;
  message: Message = {
    show: false
  };
  errorMessages: any;

  constructor(
    private afs: AngularFirestore,
    private store: StoreService,
    private modulesService: ModulesService,
    private userService: UserService,
    private menuService: MenuService,
    private router: Router
  ) {
    store.select('menu');
  }

  get f(): any {
    return this.form.controls;
  }

  ngOnInit() {
    this.uuid = this.afs.createId();

    this.errorMessages = {
      image: {
        required: 'La foto de perfíl es requerida.'
      }
    };
    this.form = new FormGroup({
      name: new FormControl('', Validators.required),
      text: new FormControl(''),
      uuid: new FormControl(''),
      customPath: new FormControl(''),
      backPath: new FormControl(''),
      absolutePath: new FormControl(''),
      url: new FormControl(''),
      externalURL: new FormControl(false),
      root: new FormControl(true),
      blocked: new FormControl(true),
      deleted: new FormControl(false)
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.menu.currentValue) {
      if (this.filter.search('edit') >= 0) {
        this.form.patchValue(changes.menu.currentValue);
      }
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
    const menuModule$: Observable<Module> = this.modulesService.getItem(
      '|menu'
    );
    const currentUser$: Observable<User> = this.userService.getItem(
      this.store.get('currentUserPermissions').path
    );

    this.ref = '|list|' + this.uuid;

    menu.text = menu.text || menu.name;

    if (this.filter.search('edit') >= 0) {
      this.ref = this.value;
      menu.customPath = this.value + '|list';
    } else if (this.filter.search('add') >= 0) {
      menu.absolutePath =
        '/projects/blank-fire/langs/es/modules/drive/list/' + menu.uuid;

      if (this.value) {
        this.ref = this.value + '|list|' + menu.uuid;

        menu.uuid = this.uuid;
        menu.customPath = this.value + '|list|' + menu.uuid + '|list';
        menu.backPath = this.value + '|list';
        menu.root = true;
        menu.absolutePath = `/projects/blank-fire/langs/es/modules/drive${this.value
          .split('|')
          .join('/')}/list/${menu.uuid}`;
      } else {
        menu.uuid = this.uuid;
        menu.customPath = '|list|' + menu.uuid + '|list';
        menu.backPath = '|list';
        menu.root = true;

        this.ref = '|list|' + menu.uuid;
      }
    } else {
      menu.uuid = this.uuid;
      menu.customPath = '|list|' + menu.uuid + '|list';
      menu.backPath = '|list';
      menu.root = true;

      this.ref = '|list|' + menu.uuid;
    }

    combineLatest([menuModule$, currentUser$])
      .pipe(first())
      .subscribe(([menuModule, currentUser]) => {
        menuModule.count = menuModule && menuModule.count ? menuModule.count : 0;

        if (
          (currentUser.permissions.menu_write &&
            !currentUser.permissions.menu_write_limit) ||
          (currentUser.permissions.menu_write &&
            currentUser.permissions.menu_write_limit &&
            currentUser.permissions.menu_write_limit_max &&
            menuModule.count <
              currentUser.permissions.menu_write_limit_max) ||
          ((this.filter.search('add') >= 0 &&
            currentUser.permissions.menu_create &&
            !currentUser.permissions.menu_create_limit) ||
            (currentUser.permissions.menu_create &&
              currentUser.permissions.menu_create_limit &&
              currentUser.permissions.menu_create_limit_max &&
              menuModule.count <
                currentUser.permissions.menu_create_limit_max)) ||
          ((this.filter.search('edit') >= 0 &&
            currentUser.permissions.menu_update &&
            !currentUser.permissions.menu_update_limit) ||
            (currentUser.permissions.menu_update &&
              currentUser.permissions.menu_update_limit &&
              currentUser.permissions.menu_update_limit_max &&
              menuModule.count <
                currentUser.permissions.menu_update_limit_max))
        ) {
          this.menuService.setItem(this.ref, menu).subscribe(() => {
            if (this.filter.search('add') >= 0) {
              menuModule.count = (menuModule.count || 0) + 1;
            }

            this.modulesService
              .setItem('|menu', menuModule)
              .pipe(first())
              .subscribe(() => {
                this.message = {
                  show: true,
                  label: 'Info',
                  sublabel: 'Guardado',
                  color: 'accent',
                  icon: 'info'
                };
              });
          });
        } else {
          this.message = {
            show: true,
            label: 'Error!',
            sublabel:
              'No tiene los permisos suficientes para hacer esta acción!',
            color: 'warn',
            icon: 'error'
          };
        }
      });

    if (this.filter.search('add') >= 0) {
      this.reset();
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
