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
import { AngularFireModule } from '@angular/fire';
import {
  AngularFirestoreModule,
  FirestoreSettingsToken
} from '@angular/fire/firestore';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { AngularFireAuthModule } from '@angular/fire/auth';

import { environment } from '../environments/environment';

import {
  LayoutDefaultComponent,
  NavbarDefaultComponent,
  LoadLayoutComponent,
  LayoutCorpayandeComponent,
  NavbarCorpayandeComponent,
  FooterCorpayandeComponent,
  LayoutTeatroJueteComponent,
  NavbarTeatroJueteComponent,
  FooterTeatroJueteComponent,
  LayoutPijaosCaciquesComponent,
  NavbarPijaosCaciquesComponent,
  FooterPijaosCaciquesComponent,
  LayoutDisabledComponent,
  LayoutUnconnectedComponent
} from './layouts';
import { AppComponent } from './app.component';
import {
  HomeComponent,
  NotFoundComponent,
  DeniedPageComponent,
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
    LayoutTeatroJueteComponent,
    NavbarTeatroJueteComponent,
    FooterTeatroJueteComponent,
    LayoutPijaosCaciquesComponent,
    NavbarPijaosCaciquesComponent,
    FooterPijaosCaciquesComponent,
    LayoutDisabledComponent,
    LayoutUnconnectedComponent,
    HomeComponent,
    NotFoundComponent,
    DeniedPageComponent,
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
    BrowserModule.withServerTransition({ appId: 'serverApp' }),
    BrowserAnimationsModule,
    AngularFireModule.initializeApp(environment.firebase, 'blank-fire'), // imports firebase/app needed for everything
    AngularFirestoreModule, // imports firebase/firestore, only needed for database features
    AngularFireAuthModule, // imports firebase/auth, only needed for auth features,
    AngularFireStorageModule, // imports firebase/storage only needed for storage features,
    NgBarnModule.forRoot({
      store: {
        loader: {
          status: true
        },
        node: {
          project: {
            'ng-fire-blank': {
              uid: 'ngfire-blank',
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
                  modules: {
                    user: {
                      enabled: {
                        list: {
                          '-user-item-1': {
                            uid: '-user-item-1',
                            cover: '',
                            photoURL: '',
                            displayName: 'Eduard Ramirez',
                            username: 'tantaroth',
                            email: 'tantaroth@gmail.com',
                            emailVerified: true,
                            currentPath: '|enabled|list|-user-item-1',
                            dbPath: '/lang/es/user/-user-item-1',
                            blocked: false,
                            deleted: false,
                            deletedCount: 0,
                            createdAt: new Date()
                          }
                        }
                      },
                      deleted: {}
                    },
                    slide: {
                      enabled: {
                        list: {
                          '-slide-item-1': {
                            uid: '-slide-item-1',
                            title: 'Afro Power',
                            image:
                              'https://images.pexels.com/photos/248797/pexels-photo-248797.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500',
                            subtitle: 'Orgullo, defensa y conciencia',
                            url: '/yudis-rivas',
                            externalURL: false,
                            currentPath: '|enabled|list|-slide-item-1',
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
                            currentPath: '|enabled|list|-slide-item-2',
                            dbPath: '/lang/es/slide/-slide-item-2',
                            blocked: false,
                            deleted: false,
                            deletedCount: 1,
                            createdAt: new Date()
                          }
                        }
                      },
                      blocked: {},
                      deleted: {}
                    },
                    page: {
                      enabled: {
                        list: {
                          '-page-item-1': {
                            uid: '-page-item-1',
                            principalPath: 'home',
                            currentPath: '|enabled|list|-page-item-1',
                            alias: ['home'],
                            title: 'Home',
                            description: 'Is the afroup website',
                            keywords: 'home, afroup',
                            content: '<h1>Home works!</h1>',
                            author: '/lang/es/user/-user-item-1',
                            cover: '',
                            postedAt: new Date(),
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
                        }
                      },
                      deleted: {}
                    },
                    menu: {
                      enabled: {
                        list: {
                          '-menu-item-1': {
                            uid: '-menu-item-1',
                            title: 'Home',
                            currentPath: '|enabled|list|-menu-item-1',
                            backPath: '',
                            enabled: {
                              list: {
                                '-menu-item-1-1': {
                                  uid: '-menu-item-1-1',
                                  title: 'Proyectos',
                                  currentPath:
                                    '|enabled|list|-menu-item-1|enabled|list|-menu-item-1-1',
                                  backPath: '|enabled|list|-menu-item-1',
                                  enabled: {},
                                  url: 'https://portafol.io/afroup',
                                  externalURL: true,
                                  dbPath:
                                    '/lang/es/menu/-menu-item-1/menu/-menu-item-1-1',
                                  blocked: false,
                                  deleted: false,
                                  deletedCount: 0,
                                  createdAt: new Date()
                                }
                              }
                            },
                            url: '/home',
                            externalURL: false,
                            root: true,
                            dbPath: '/lang/es/menu/-menu-item-1',
                            blocked: false,
                            deleted: false,
                            deletedCount: 0,
                            createdAt: new Date()
                          }
                        }
                      },
                      blocked: {},
                      deleted: {}
                    },
                    file: {
                      list: {
                        enabled: {
                          '-file-item-1': {
                            uid: '-file-item-1',
                            title: 'Carpeta 1',
                            currentPath: '|enabled|list|-file-item-1',
                            backPath: '',
                            list: {
                              enabled: {
                                '-file-item-1-1': {
                                  uid: '-file-item-1-1',
                                  title: 'carpeta 1.1',
                                  currentPath:
                                    '|enabled|list|-file-item-1|enabled|list|-file-item-1-1',
                                  backPath: '|enabled|list|-file-item-1',
                                  enabled: {},
                                  url: 'https://portafol.io/afroup',
                                  externalURL: true,
                                  type: 'folder',
                                  dbPath:
                                    '/lang/es/file/-file-item-1/file/-file-item-1-1',
                                  blocked: false,
                                  deleted: false,
                                  deletedCount: 0,
                                  createdAt: new Date()
                                }
                              }
                            },
                            url: '/home',
                            externalURL: false,
                            type: 'folder',
                            root: true,
                            dbPath: '/lang/es/file/-file-item-1',
                            blocked: false,
                            deleted: false,
                            deletedCount: 0,
                            createdAt: new Date()
                          }
                        },
                        blocked: {},
                        deleted: {}
                      }
                    }
                  }
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
        authenticated: {},
        currentUserPermissions: {}
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
  providers: [{ provide: FirestoreSettingsToken, useValue: {} }],
  bootstrap: [AppComponent]
})
export class AppModule {}
