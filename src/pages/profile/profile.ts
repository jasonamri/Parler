import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { AlertController } from 'ionic-angular';

import { AngularFireStorage } from '@angular/fire/storage';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';



@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html'
})
export class ProfilePage {

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private storage: AngularFireStorage,
    public afAuth: AngularFireAuth,
    public alert: AlertController,
    public afs: AngularFirestore,
    ) {
  }

  private uid: string = this.navParams.get('uid');
  //private uid: string = "LjMxndsc23PGZKFSC9C2bd5Mtgt1"

  public name: string = "Loading..."
  public photoURL: string = "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7e/Circle-icons-profile.svg/768px-Circle-icons-profile.svg.png"
  public bio: string = "Loading..."


  actOnMatch(action) {
    var user = this.afAuth.auth.currentUser;
    var docRef = this.afs.collection('matches').doc(this.navParams.get('id')) 
    docRef.get().subscribe(snapshot => {
      if (snapshot.data().user_id_primary == user.uid) {
        //active user is primary
        docRef.update({accepted_by_primary : action});
      } else {
        //active user is secondary
        docRef.update({accepted_by_secondary : action});
      }

      if (action == 1) {
        this.showAlert("Accepted!", "Match accepted successfully!")
      } else {
        this.showAlert("Rejected!", "Match rejected successfully!")
      }

      this.navCtrl.pop();
    })
  }

  ionViewDidLoad() {
    //get name, photo, and bio
    let docRef = this.afs.collection("users").doc(this.uid);
    docRef.get().subscribe(snapshot => {
      this.name = snapshot.data().name;
      this.bio = snapshot.data().bio;

      let fileRef = this.storage.ref(this.uid + ".jpeg");
      fileRef.getDownloadURL().subscribe(url => {
        this.photoURL = url;
      })
    })
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
