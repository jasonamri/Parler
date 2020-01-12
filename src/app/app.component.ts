import { Component, ViewChild } from '@angular/core';
import { Platform, Nav, AlertController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { SignupPage } from '../pages/signup/signup';
import { LoginPage } from '../pages/login/login';


import { LanguagePage } from '../pages/language/language';
import { WelcomePage } from '../pages/welcome/welcome';
import { InterestsPage } from '../pages/interests/interests';
import { BioPage } from '../pages/bio/bio';
import { MatchesPage } from '../pages/matches/matches';
import { ProfilePage } from '../pages/profile/profile';
import { MessagesPage } from '../pages/messages/messages';
import { ChatPage } from '../pages/chat/chat';


import { AngularFireAuth } from '@angular/fire/auth';


@Component({
  templateUrl: 'app.html'
})
export class Parler {
  @ViewChild(Nav) navCtrl: Nav;
    rootPage:any = LoginPage;

  constructor(
    platform: Platform, 
    statusBar: StatusBar, 
    splashScreen: SplashScreen,
    public alert: AlertController,
    public afAuth: AngularFireAuth,
    ) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
    });
  }
  goToMessages(params){
    if (!params) params = {};
    this.navCtrl.setRoot(MessagesPage);
  }
  goToMatches(params){
    if (!params) params = {};
    this.navCtrl.setRoot(MatchesPage);
  }
  goToSettings(params){
    if (!params) params = {};
    //this.navCtrl.setRoot(LoginPage);
  }
  signOut(params){
    this.afAuth.auth.signOut()
    this.showAlert("Signed Out!", "Successfully signed out.")
    this.navCtrl.setRoot(LoginPage);
  }


  async showAlert(title: string, message: string) {
    const alert = await this.alert.create({
      title,
      message,
      buttons: ["Ok"]
    })
  
    await alert.present();
  }
}

