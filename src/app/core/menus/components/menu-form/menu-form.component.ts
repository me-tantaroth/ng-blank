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
import { Observable } from 'rxjs';

import { MenuService } from '../../services/menu.service';

import { Menu } from '../../models/menu';
import { Message } from '../../../../models/message';

@Component({
  selector: 'app-menu-form',
  templateUrl: './menu-form.component.html',
  styleUrls: ['./menu-form.component.scss']
})
export class MenuFormComponent implements OnInit, OnChanges {
  @Input() menu: Menu;
  @Input() filter: string;
  @Input() value: string;

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

    menu.text = menu.name;

    if (this.filter.search('edit') >= 0) {
      menu.customPath = this.value + '|list';

      this.menuService.setItem(this.value, menu).subscribe(() => {
        this.message = {
          show: true,
          label: 'Info',
          sublabel: 'Guardado',
          color: 'accent',
          icon: 'info'
        };
      });
    } else if (this.filter.search('add') >= 0) {
      menu.absolutePath =
        '/projects/blank-fire/langs/es/modules/drive/list/' + menu.uuid;

      if (this.value) {
        menu.uuid = this.afs.createId();
        menu.customPath = this.value + '|list|' + menu.uuid + '|list';
        menu.backPath = this.value + '|list';
        menu.root = true;
        menu.absolutePath = `/projects/blank-fire/langs/es/modules/drive${this.value
          .split('|')
          .join('/')}/list/${menu.uuid}`;

        this.menuService
          .setItem(this.value + '|list|' + menu.uuid, menu)
          .subscribe(() => {
            this.message = {
              show: true,
              label: 'Info',
              sublabel: 'Guardado',
              color: 'accent',
              icon: 'info'
            };
          });
      } else {
        menu.uuid = this.afs.createId();
        menu.customPath = '|list|' + menu.uuid + '|list';
        menu.backPath = '|list';
        menu.root = true;

        this.menuService.setItem('|list|' + menu.uuid, menu).subscribe(() => {
          this.message = {
            show: true,
            label: 'Info',
            sublabel: 'Guardado',
            color: 'accent',
            icon: 'info'
          };
        });
      }
    } else {
      menu.uuid = this.afs.createId();
      menu.customPath = '|list|' + menu.uuid + '|list';
      menu.backPath = '|list';
      menu.root = true;

      this.menuService.setItem('|list|' + menu.uuid, menu).subscribe(() => {
        this.message = {
          show: true,
          label: 'Info',
          sublabel: 'Guardado',
          color: 'accent',
          icon: 'info'
        };
      });
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
