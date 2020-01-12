import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { AngularFireStorage } from '@angular/fire/storage';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';

import { AlertController } from 'ionic-angular';
import { ProfilePage } from '../profile/profile';


@Component({
  selector: 'page-matches',
  templateUrl: 'matches.html'
})
export class MatchesPage {

  constructor(
    public navCtrl: NavController,
    private storage: AngularFireStorage,
    public afAuth: AngularFireAuth,
    public alert: AlertController,
    public afs: AngularFirestore,
    ) {
  }

  /*public matches: any[] = [
    {
      id: "0",
      uid: "0",
      name: 'No matches found.',
      photoURL: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7e/Circle-icons-profile.svg/768px-Circle-icons-profile.svg.png"
    }
  ]*/

  public matches: any[] = []

  public loading: boolean = false;

  ionViewWillEnter() {
    //console.log("refreshing...");

    //.limit(10)
    var user = this.afAuth.auth.currentUser;
    //var user = {uid: "sxpkANoJ1JPrYPkPVifC06aCcMA3"}

    this.matches = []

    this.afs.collection('matches', ref => ref.where('user_id_primary', '==', user.uid.toString()).where('accepted_by_primary', '==', 0).where('accepted_by_secondary','<',2))
    .snapshotChanges()
    .subscribe(querySnapshot => {
      querySnapshot.forEach(document => {
        // doc.data() is never undefined for query doc snapshots
        //console.log(doc.id, " => ", doc.data());

        const doc = document.payload.doc

        //match id
        let matchId = doc.id;

        //console.log(matchId)
  
        //check if entry is already shown
        let found = false;
        this.matches.forEach(match=> {
          //console.log(match.id)
          //console.log(matchId)
          if (match.id == matchId) {found = true}
        })


        if (!found) {
          //temp values
          let matchUserName;
          let matchUserPhoto;
    
          //identify user
          let matchUserId = (doc.data() as any).user_id_secondary;
    
          //get their name
          let docRef = this.afs.collection("users").doc(matchUserId);
          docRef.get().subscribe(snapshot => {
            matchUserName = snapshot.data().name;
    
            //get their photo
            let fileRef = this.storage.ref(matchUserId + ".jpeg");
            fileRef.getDownloadURL().subscribe(url => {
              matchUserPhoto = url;
    
              found = false;
              this.matches.forEach(match=> {
                if (match.id == matchId) {found = true}
              })

              if (!found) {
                this.matches.push({
                  id: matchId,
                  uid: matchUserId,
                  name: matchUserName,
                  photoURL: matchUserPhoto
                })
              }
            })
          })
        }
      });
    })

    this.afs.collection('matches', ref => ref.where('user_id_secondary', '==', user.uid.toString()).where('accepted_by_secondary', '==', 0).where('accepted_by_primary','<',2))
    .snapshotChanges()
    .subscribe(querySnapshot => {
      querySnapshot.forEach(document => {
        // doc.data() is never undefined for query doc snapshots
        //console.log(doc.id, " => ", doc.data());
  
        const doc = document.payload.doc

        //match id
        let matchId = doc.id;

        //check if entry is already shown
        let found = false;
        this.matches.forEach(match=> {
          if (match.id == matchId) {found = true}
        })


        if (!found) {
  
          //temp values
          let matchUserName;
          let matchUserPhoto;
    
          //identify user
          let matchUserId = (doc.data() as any).user_id_primary;
    
          //get their name
          let docRef = this.afs.collection("users").doc(matchUserId);
          docRef.get().subscribe(snapshot => {
            matchUserName = snapshot.data().name;
    
            //get their photo
            let fileRef = this.storage.ref(matchUserId + ".jpeg");
            fileRef.getDownloadURL().subscribe(url => {
              matchUserPhoto = url;
    
              found = false;
              this.matches.forEach(match=> {
                if (match.id == matchId) {found = true}
              })

              if (!found) {
                this.matches.push({
                  id: matchId,
                  uid: matchUserId,
                  name: matchUserName,
                  photoURL: matchUserPhoto
                })
              }
    
            })
          })
        }
      });
    })
  }

  getBitCount(value) {
      let count = 0;
      while(value)
      {
          count += (value & 1);
          value = value >> 1;
      }

      return count;
  }

  addMatch(primaryId, secondaryId) {

    let data = {
      user_id_primary: primaryId,
      user_id_secondary: secondaryId,
      accepted_by_primary: 0,
      accepted_by_secondary: 0      
    }

    let result = this.afs.collection('matches').add(data);

    return result

  }

  refreshMatches(){

    this.loading = true

    var user = this.afAuth.auth.currentUser;
    //var user = { uid: "sxpkANoJ1JPrYPkPVifC06aCcMA3" }
    
    this.afs.collection('users').doc(user.uid)
    .get()
    .subscribe(userDoc => {
      let userInterests = userDoc.data().interests
      let previousMatches = [user.uid]

      this.afs.collection('matches', ref => ref.where('user_id_primary', '==', user.uid.toString()))
      .get()
      .subscribe(priMatchesDoc => {
        priMatchesDoc.forEach(priMatch => {
          previousMatches.push(priMatch.data().user_id_secondary)
        })

        this.afs.collection('matches', ref => ref.where('user_id_secondary', '==', user.uid.toString()))
        .get()
        .subscribe(secMatchesDoc => {
          secMatchesDoc.forEach(secMatch => {
            previousMatches.push(secMatch.data().user_id_primary)
          })

          this.afs.collection('users')
          .get()
          .subscribe(usersDocs => {
            usersDocs.forEach(userDoc => {

              if (!previousMatches.includes(userDoc.id)) {
                
                let matchInterests = userDoc.data().interests
                let similarInterests = this.getBitCount(userInterests & matchInterests)

                if (similarInterests > 2) {
                  this.addMatch(user.uid, userDoc.id)
                }
              }

              this.loading = false
            })
          })
        })
      })
    })
  }

  showProfile(id, uid) {
    //console.log(uid)
    this.navCtrl.push(ProfilePage, {uid: uid, id : id})
    //console.log("after")
  }
  
}
