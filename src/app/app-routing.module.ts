import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthModule } from './auth/auth.module';

import { HomeComponent } from './pages';

const routes: Routes = [{
  path: '',
  component: HomeComponent,
}, {
  path: 'auth',
  loadChildren: () => AuthModule
}];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
