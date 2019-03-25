import { NgModule } from '@angular/core';
import { UsersModule } from './users/users.module';
import { SlidesModule } from './slides/slides.module';
import { PagesModule } from './pages/pages.module';
import { MenusModule } from './menus/menus.module';
import { AuthModule } from './auth/auth.module';

@NgModule({
  exports: [UsersModule, SlidesModule, PagesModule, MenusModule, AuthModule]
})
export class CoreModule {}
