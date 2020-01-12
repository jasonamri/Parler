import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';



import { AlertController } from 'ionic-angular';
import { WelcomePage } from '../welcome/welcome';
import { LoginPage } from '../login/login';
import { InterestsPage } from '../interests/interests';

import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import firebase from 'firebase';



@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html'
})
export class SignupPage {

  email: string = ""
  password: string = ""
  name: string = ""

  constructor(
    public navCtrl: NavController, 
    public afAuth: AngularFireAuth,
    public alert: AlertController,
    public afs: AngularFirestore,
    ) {
  }

  goToLogin(params){
    if (!params) params = {};
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

  async signup() {
    const { email, password, name } = this

    try {
      const res = await this.afAuth.auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL)
      .then(() => {
        // New sign-in will be persisted with session persistence.
        return this.afAuth.auth.createUserWithEmailAndPassword(email, password)
      })
      .catch((error) => {
        // Handle Errors here.
        throw error;
      });
      
      
      //console.log(res)
      var user = this.afAuth.auth.currentUser;

      if (user != null) {
        user.updateProfile({
          displayName: name,
        })

        var data = {
          bio: "",
          interests: 0,
          lang: 0,
          name: name
        };
        
        var setDoc = this.afs.collection('users').doc(user.uid).set(data);
  
        //console.log(setDoc);

        this.showAlert("Success!", "Welcome to Parler!");
        this.navCtrl.setRoot(InterestsPage)
      } else {
        throw "User not logged in!"
      }
    } catch (err) {
      console.dir(err)
      this.showAlert("Error!", err.message)
    }

  }
    
  

  

  
}
