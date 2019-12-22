import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { AngularFireAuth } from '@angular/fire/auth';
import { auth } from 'firebase/app';

import { AlertController } from 'ionic-angular';

import { WelcomePage } from '../welcome/welcome';
import { SignupPage } from '../signup/signup';
import { InterestsPage } from '../interests/interests';

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
  goToSignup(params){
    if (!params) params = {};
    this.navCtrl.push(SignupPage);
  }

  async login() {
    const {email, password} = this

    try {
      const res = await this.afAuth.auth.signInWithEmailAndPassword(email, password)
      console.log(res)
      this.showAlert("Success!", "Welcome to Parler!")
      this.navCtrl.setRoot(InterestsPage)
      //this.navCtrl.goToRoot
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
