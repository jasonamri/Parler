import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { LoginPage } from '../pages/login/login';
import { SignupPage } from '../pages/signup/signup';
import { LanguagePage } from '../pages/language/language';
import { WelcomePage } from '../pages/welcome/welcome';
import { InterestsPage } from '../pages/interests/interests';
import { BioPage } from '../pages/bio/bio';


import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Camera } from '@ionic-native/camera';

import firebaseConfig from './firebase';

import { AngularFireModule } from '@angular/fire';
import { AngularFireAuthModule }  from '@angular/fire/auth'
import { AngularFirestore } from '@angular/fire/firestore';

@NgModule({
  declarations: [
    MyApp,
    LoginPage,
    SignupPage,
    LanguagePage,
    WelcomePage,
    InterestsPage,
    BioPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFireAuthModule,
    //AngularFirestore
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    LoginPage,
    SignupPage,
    LanguagePage,
    WelcomePage,
    InterestsPage,
    BioPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    AngularFirestore,
    Camera
  ]
})
export class AppModule {}