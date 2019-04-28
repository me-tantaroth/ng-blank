import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

import { AuthService } from '../../core/auth/services/auth.service';

@Component({
  selector: 'app-layout-teatro-juete',
  templateUrl: './layout-teatro-juete.component.html',
  styleUrls: ['./layout-teatro-juete.component.scss']
})
export class LayoutTeatroJueteComponent implements OnInit {
  authenticated: Observable<boolean>;

  constructor(private router: Router, private auth: AuthService) {}

  ngOnInit() {
    this.authenticated = this.auth.authenticated;
  }

  signOut() {
    this.auth
      .signOut()
      .subscribe((status) => {
        if (status) {
          this.router.navigate(['/auth/sign-out']);
        }
      })
      .unsubscribe();
  }
}
