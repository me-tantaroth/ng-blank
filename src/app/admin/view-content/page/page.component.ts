import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-page',
  templateUrl: './page.component.html',
  styleUrls: ['./page.component.scss']
})
export class PageComponent implements OnInit {
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
