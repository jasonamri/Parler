import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { AlertController } from 'ionic-angular';

import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { BioPage } from '../bio/bio';

@Component({
  selector: 'page-interests',
  templateUrl: 'interests.html'
})
export class InterestsPage {

  constructor(
    public navCtrl: NavController,
    public afAuth: AngularFireAuth,
    public alert: AlertController,
    public afs: AngularFirestore,
    ) {
  }

  public form = [
    { val: 'Arts / Theatre', isChecked: false },
    { val: 'Sports', isChecked: false },
    { val: 'Entrepreneurship', isChecked: false },
    { val: 'Video Games', isChecked: false },
    { val: 'Music', isChecked: false },
    { val: 'Nature', isChecked: false },
    { val: 'Reading', isChecked: false },
    { val: 'Fashion', isChecked: false },
    { val: 'Food', isChecked: false },
    { val: 'Science / Math / Technology', isChecked: false },
    { val: 'Travel', isChecked: false }
  ];
  
  setInterests() {
    var interestsSet = 0;

    for (var option in this.form) {
      //let index = this.form.findIndex(val => val === option.val);
      if (this.form[option].isChecked) {
        interestsSet += Math.pow(2, parseInt(option));
        
      }
    }

    //console.log(interests);

    var user = this.afAuth.auth.currentUser;

    if (user != null) {
      
      var setDoc = this.afs.collection('users').doc(user.uid).update({interests: interestsSet});

      this.showAlert("Success!", "Updated interests!");
      this.navCtrl.setRoot(BioPage)
    } else {
      throw "User not logged in!"
    }

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
