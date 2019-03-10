import { Component, OnInit } from '@angular/core';
import { StoreService } from 'ng-barn';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent implements OnInit {
  users: any[] = [];

  constructor(private store: StoreService) {
    store.select('users');
  }

  ngOnInit() {
    console.log(this.store.get());
    this.users = this.store.get();
  }

}
