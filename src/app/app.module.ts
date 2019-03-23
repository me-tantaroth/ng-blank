import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { NgBarnModule } from 'ng-barn';
import { MaterialModule } from './material.module';
import { CovalentModule } from './covalent.module';
import { SharedModule } from './shared/shared.module';
import { AppRoutingModule } from './app-routing.module';
import { LayoutsModule } from './layouts/layouts.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';

import { environment } from '../environments/environment';

import { AppComponent } from './app.component';
import { HomeComponent, NotFoundComponent, DashboardComponent } from './pages';
import { LangsModule } from './langs/langs.module';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    NotFoundComponent,
    DashboardComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AngularFireModule.initializeApp(environment.firebase, 'ng-blank'), // imports firebase/app needed for everything
    AngularFirestoreModule, // imports firebase/firestore, only needed for database features
    AngularFireAuthModule, // imports firebase/auth, only needed for auth features,
    AngularFireStorageModule, // imports firebase/storage only needed for storage features,
    NgBarnModule.forRoot({
      store: {
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
                displayName: 'Eduard Ramirez',
                username: 'tantaroth',
                email: 'tantaroth@gmail.com',
                cite: 'La libertad siempre ha sido importante para mi.',
                aboutMe: 'Hola, soy Eduard Ramirez!',
                phoneNumber: 3150339393,
                blocked: false,
                emailVerified: true,
                createdAt: new Date()
              }
            ]
          }
        },
        users: [],
        authentications: [],
        authenticated: {}
      }
    }),
    MaterialModule,
    CovalentModule,
    SharedModule,
    AppRoutingModule,
    LayoutsModule,
    AuthModule,
    UsersModule,
    LangsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
