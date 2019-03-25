import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {
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
