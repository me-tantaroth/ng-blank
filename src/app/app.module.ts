import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LangsModule } from './langs/langs.module';
import { NgBarnModule } from 'ng-barn';
import { MaterialModule } from './material.module';
import { CovalentModule } from './covalent.module';
import { SharedModule } from './shared/shared.module';
import { AppRoutingModule } from './app-routing.module';
import { AdminModule } from './admin/admin.module';
import { CoreModule } from './core/core.module';

import {
  LayoutDefaultComponent,
  NavbarDefaultComponent,
  LoadLayoutComponent,
  LayoutCorpayandeComponent,
  NavbarCorpayandeComponent,
  FooterCorpayandeComponent
} from './layouts';
import { AppComponent } from './app.component';
import {
  HomeComponent,
  NotFoundComponent,
  SignInComponent,
  SignOutComponent,
  SignUpComponent,
  RecoveryComponent,
  UserViewComponent,
  PageViewComponent,
  FilesComponent
} from './view-content';
import {
  FileListPluginComponent,
  SlideshowPluginComponent
} from './components';

@NgModule({
  declarations: [
    AppComponent,
    NavbarDefaultComponent,
    LayoutDefaultComponent,
    LayoutCorpayandeComponent,
    NavbarCorpayandeComponent,
    FooterCorpayandeComponent,
    HomeComponent,
    NotFoundComponent,
    SignInComponent,
    SignOutComponent,
    SignUpComponent,
    RecoveryComponent,
    UserViewComponent,
    PageViewComponent,
    FilesComponent,
    FileListPluginComponent,
    SlideshowPluginComponent,
    FileListPluginComponent,
    SlideshowPluginComponent,
    LoadLayoutComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    NgBarnModule.forRoot({
      store: {
        node: {
          'ng-fire-blank': {
            uid: 'ng-fire-blank',
            title: 'NG Fire Blank',
            lang: {
              es: {
                uid: 'es',
                title: 'Español',
                dbPath: '/lang/es',
                blocked: false,
                deleted: false,
                deletedCount: 0,
                createdAt: new Date(),
                user: {
                  enabled: {
                    '-user-item-1': {
                      uid: '-user-item-1',
                      cover: '',
                      photoURL: '',
                      display: 'Eduard Ramirez',
                      username: 'tantaroth',
                      email: 'tantaroth@gmail.com',
                      emailVerified: true,
                      dbPath: '/lang/es/user/-user-item-1',
                      blocked: false,
                      deleted: false,
                      deletedCount: 0,
                      createdAt: new Date()
                    },
                    deleted: {}
                  }
                },
                slide: {
                  enabled: {
                    '-slide-item-1': {
                      uid: '-slide-item-1',
                      title: 'Afro Power',
                      image:
                        'https://images.pexels.com/photos/248797/pexels-photo-248797.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500',
                      subtitle: 'Orgullo, defensa y conciencia',
                      url: '/yudis-rivas',
                      externalURL: false,
                      dbPath: '/lang/es/slide/-slide-item-1',
                      blocked: false,
                      deleted: false,
                      deletedCount: 1,
                      createdAt: new Date()
                    },
                    '-slide-item-2': {
                      uid: '-slide-item-2',
                      title: 'Afro Power!2',
                      image:
                        'https://images.pexels.com/photos/248797/pexels-photo-248797.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500',
                      subtitle: 'Orgullo, defensa y conciencia',
                      url: '/yudis-rivas',
                      externalURL: false,
                      dbPath: '/lang/es/slide/-slide-item-2',
                      blocked: false,
                      deleted: false,
                      deletedCount: 1,
                      createdAt: new Date()
                    }
                  },
                  blocked: {},
                  deleted: {}
                },
                page: {
                  enabled: {
                    '-page-item-1': {
                      uid: '-page-item-1',
                      principalPath: '',
                      alias: ['home'],
                      title: 'Home',
                      description: 'Is the afroup website',
                      keywords: 'home, afroup',
                      content: '<h1>Home works!</h1>',
                      author: '/lang/es/user/-user-item-1',
                      cover: '',
                      theme: {
                        color: 'black'
                      },
                      type: 'article',
                      views: 0,
                      dbPath: '/lang/es/page/-page-item-1',
                      blocked: false,
                      deleted: false,
                      deletedCount: 1,
                      createdAt: new Date()
                    }
                  },
                  deleted: {}
                },
                menu: {
                  enabled: {
                    '-menu-item-1': {
                      uid: '-menu-item-1',
                      text: 'Home',
                      backPath: '/lang/es/menu',
                      menu: {
                        '-menu-item-1-1': {
                          uid: '-menu-item-1',
                          text: 'Proyectos',
                          backPath: '/lang/es/menu/-menu-item-1',
                          menu: {},
                          url: 'https://portafol.io/afroup',
                          external: true,
                          root: true,
                          dbPath:
                            '/lang/es/menu/-menu-item-1/menu/-menu-item-1-1',
                          blocked: false,
                          deleted: false,
                          deletedCount: 0,
                          createdAt: new Date()
                        }
                      },
                      url: '/home',
                      external: false,
                      root: true,
                      dbPath: '/lang/es/menu/-menu-item-1',
                      blocked: false,
                      deleted: false,
                      deletedCount: 0,
                      createdAt: new Date()
                    }
                  },
                  deleted: {}
                }
              }
            }
          }
        },
        langs: [
          {
            code: 'en-US',
            label: 'English'
          }
        ],
        'langs-node': {
          'en-US': {
            code: 'en-US',
            label: 'English',
            users: [
              {
                uid: 'user-Kajsdhuasud231',
                index: 0,
                displayName: 'Eduard Ramirez',
                username: 'tantaroth',
                email: 'tantaroth@gmail.com',
                cite: 'La libertad siempre ha sido importante para mi.',
                aboutMe: 'Hola, soy Eduard Ramirez!',
                phoneNumber: 3150339393,
                blocked: false,
                deleted: false,
                emailVerified: true,
                createdAt: new Date()
              }
            ],
            menu: [],
            files: []
          }
        },
        users: [],
        pages: [],
        slides: [],
        menu: [],
        files: [],
        authentications: [],
        authenticated: {}
      }
    }),
    MaterialModule,
    CovalentModule,
    SharedModule,
    AppRoutingModule,
    AdminModule,
    CoreModule,
    LangsModule
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
