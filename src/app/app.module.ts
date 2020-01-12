import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { Parler } from './app.component';
import { LoginPage } from '../pages/login/login';
import { SignupPage } from '../pages/signup/signup';
import { LanguagePage } from '../pages/language/language';
import { WelcomePage } from '../pages/welcome/welcome';
import { InterestsPage } from '../pages/interests/interests';
import { BioPage } from '../pages/bio/bio';
import { MatchesPage } from '../pages/matches/matches';
import { ProfilePage } from '../pages/profile/profile';
import { MessagesPage } from '../pages/messages/messages';
import { ChatPage } from '../pages/chat/chat';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Camera } from '@ionic-native/camera';

import firebaseConfig from './firebase';

import { AngularFireModule } from '@angular/fire';
import { AngularFireAuthModule }  from '@angular/fire/auth'
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { AngularFireMessagingModule } from '@angular/fire/messaging';


@NgModule({
  declarations: [
    LoginPage,
    SignupPage,
    LanguagePage,
    WelcomePage,
    InterestsPage,
    BioPage,
    MatchesPage,
    ProfilePage,
    MessagesPage,
    ChatPage,
    Parler
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(Parler),
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFireAuthModule,
    //AngularFirestore
    AngularFireStorageModule,
    AngularFireMessagingModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    LoginPage,
    SignupPage,
    LanguagePage,
    WelcomePage,
    InterestsPage,
    BioPage,
    MatchesPage,
    ProfilePage,
    MessagesPage,
    ChatPage,
    Parler
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