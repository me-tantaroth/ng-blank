import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ActivationEnd } from '@angular/router';

@Component({
  selector: 'app-slides',
  templateUrl: './slides.component.html',
  styleUrls: ['./slides.component.scss']
})
export class SlidesComponent implements OnInit {
  filter: string;
  value: string;

  constructor(private router: Router, private route: ActivatedRoute) {
    this.router.events.subscribe((data) => {
      if (data instanceof ActivationEnd) {
        if (!!data.snapshot.params.filter) {
          this.filter = data.snapshot.params.filter;
        }
        if (!!data.snapshot.params.value) {
          this.value = data.snapshot.params.value;
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

    const value = this.route.snapshot.paramMap.get('value');

    if (value) {
      this.value = value;
    } else {
      this.route.paramMap
        .subscribe((params) => {
          this.value = params.get('value');
        })
        .unsubscribe();
    }
  }
}
