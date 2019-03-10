import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UsersComponent, UserComponent } from './pages';

const routes: Routes = [
  {
    path: 'list',
    component: UsersComponent
  },
  {
    path: 'form',
    component: UserComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UsersRoutingModule {}
