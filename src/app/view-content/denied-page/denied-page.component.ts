import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';

@Component({
  selector: 'app-denied-page',
  templateUrl: './denied-page.component.html',
  styleUrls: ['./denied-page.component.scss']
})
export class DeniedPageComponent implements OnInit {
  constructor(private _location: Location) {}

  ngOnInit() {}

  goBack() {
    this._location.back();
  }
}
