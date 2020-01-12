import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { AngularFireAuth } from '@angular/fire/auth';

import { AlertController } from 'ionic-angular';

import { SignupPage } from '../signup/signup';
import { MatchesPage } from '../matches/matches';
import firebase from 'firebase';
import { MessagesPage } from '../messages/messages';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {

  email: string = ""
  password: string = ""

  constructor(
    public navCtrl: NavController, 
    public afAuth: AngularFireAuth,
    public alert: AlertController
    ) {

  }

  ionViewWillLoad() {
    var user = this.afAuth.auth.currentUser;
    console.log(user)
  }

  goToSignup(params){
    //if (!params) params = {};
    this.navCtrl.setRoot(SignupPage)
  }

  async login() {
    const {email, password} = this

    try {
      const res = await this.afAuth.auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL)
      .then(() => {
        // New sign-in will be persisted with session persistence.
        return this.afAuth.auth.signInWithEmailAndPassword(email, password)
      })
      .catch((error) => {
        // Handle Errors here.
        throw error;
      });

      this.navCtrl.setRoot(MessagesPage)

    } catch(err) {
      console.dir(err)
      if(err.code === "auth/user-not-found") {
        console.log("User not found")
      }
      this.showAlert("Error!", err.message)
    }

  }

  async showAlert(title: string, message: string) {
    const alert = await this.alert.create({
      title,
      message,
      buttons: ["Ok"]
    })

    await alert.present()
  }
  
}
