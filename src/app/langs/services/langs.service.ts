import { Injectable } from '@angular/core';
import { StoreService } from 'ng-barn';

@Injectable({
  providedIn: 'root'
})
export class LangsService {

  currentLang = navigator.language;

  constructor(private store: StoreService) { }
}
