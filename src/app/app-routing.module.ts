import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';

import { SignInGuard } from './auth/guards/sign-in.guard';

import { HomeComponent, NotFoundComponent, DashboardComponent } from './pages';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [SignInGuard]
  },
  {
    path: 'auth',
    loadChildren: () => AuthModule
  },
  {
    path: 'user',
    loadChildren: () => UsersModule
  },
  {
    path: 'not-found',
    component: NotFoundComponent
  },
  {
    path: '**',
    component: NotFoundComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
