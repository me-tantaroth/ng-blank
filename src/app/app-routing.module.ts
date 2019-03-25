import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { PagesModule } from './pages/pages.module';
import { SlidesModule } from './slides/slides.module';
import { MenusModule } from './menus/menus.module';

import { SignInGuard } from './auth/guards/sign-in.guard';

import { HomeComponent, NotFoundComponent, DashboardComponent, TrashComponent } from './layout-content';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent
  },
  {
    path: 'not-found',
    component: NotFoundComponent
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
    path: 'page',
    loadChildren: () => PagesModule
  },
  {
    path: 'slide',
    loadChildren: () => SlidesModule
  },
  {
    path: 'menu',
    loadChildren: () => MenusModule
  },
  {
    path: 'trash',
    component: TrashComponent,
    canActivate: [SignInGuard]
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
