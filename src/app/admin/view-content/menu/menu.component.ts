import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit {
  uid: string;
  path: string;

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    const uid = this.route.snapshot.paramMap.get('uid');
    const path = this.route.snapshot.paramMap.get('path');

    if (uid) {
      this.uid = uid;
    } else {
      this.route.paramMap
        .subscribe((params) => {
          if (params.get('uid')) {
            this.uid = params.get('uid');
          }
        })
        .unsubscribe();
    }

    if (path) {
      this.path = path;
    } else {
      this.route.paramMap
        .subscribe((params) => {
          if (params.get('path')) {
            this.path = params.get('path');
          }
        })
        .unsubscribe();
    }
  }
}
