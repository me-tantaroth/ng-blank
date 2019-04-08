import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ActivationEnd } from '@angular/router';

@Component({
  selector: 'app-pages',
  templateUrl: './pages.component.html',
  styleUrls: ['./pages.component.scss']
})
export class PagesComponent implements OnInit {
  filter: string;

  constructor(private router: Router, private route: ActivatedRoute) {
    this.router.events.subscribe((data) => {
      if (data instanceof ActivationEnd) {
        if (!!data.snapshot.params.filter) {
          this.filter = data.snapshot.params.filter;
        }
      }
    });
  }

  ngOnInit() {
    const filter = this.route.snapshot.paramMap.get('filter');

    if (filter) {
      this.filter = filter;
    } else {
      this.route.paramMap
        .subscribe((params) => {
          this.filter = params.get('filter');
        })
        .unsubscribe();
    }
  }
}
