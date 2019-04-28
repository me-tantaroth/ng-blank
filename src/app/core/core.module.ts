import { NgModule } from '@angular/core';
import { UsersModule } from './users/users.module';
import { SlidesModule } from './slides/slides.module';
import { PagesModule } from './pages/pages.module';
import { MenusModule } from './menus/menus.module';
import { FilesModule } from './files/files.module';
import { AuthModule } from './auth/auth.module';
import { ModulesModule } from './modules/modules.module';

@NgModule({
  exports: [
    UsersModule,
    SlidesModule,
    PagesModule,
    MenusModule,
    FilesModule,
    AuthModule,
    ModulesModule
  ]
})
export class CoreModule {}
