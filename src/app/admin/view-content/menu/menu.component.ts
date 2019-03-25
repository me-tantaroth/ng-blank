import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit {
  uid: string;

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    const uid = this.route.snapshot.paramMap.get('uid');

    if (uid) {
      this.uid = uid;
    } else {
      this.route.paramMap
        .subscribe((params) => {
          this.uid = params.get('uid');
        })
        .unsubscribe();
    }
  }
}
