import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { AngularFireStorage } from '@angular/fire/storage';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { ChatPage } from '../chat/chat';
import { MatchesPage } from '../matches/matches';

@Component({
  selector: 'page-messages',
  templateUrl: 'messages.html'
})
export class MessagesPage {

  constructor(
    public navCtrl: NavController,
    private storage: AngularFireStorage,
    public afAuth: AngularFireAuth,
    public afs: AngularFirestore,
    ) {
  }

  /*public chats: any[] = [
    {
      id: "0",
      uid: "0",
      name: 'No matches found.',
      photoURL: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7e/Circle-icons-profile.svg/768px-Circle-icons-profile.svg.png",
      latestMessage: "No matches found",
      read: false
    }
  ]*/

  public chats: any[] = []
  
  
  ionViewWillEnter() {
    //console.log("refreshing...");

    //.limit(10)
    var user = this.afAuth.auth.currentUser;

    //as primary
    this.afs.collection('matches', ref => ref.where('user_id_primary', '==', user.uid.toString()).where('accepted_by_primary', '==', 1).where('accepted_by_secondary', '==', 1))
    .get()
    .subscribe(userSnapshot => {
      //for each match
      userSnapshot.forEach(doc => {

        //match id
        let chatId = doc.id;

        //find if entry already exists
        let found = false;
        let index;
        this.chats.forEach((chat, i)=> {
          if (chat.id == chatId) {
            found = true
            index = i
          }
        })

        if (!found) {
          //temp values
          let chatUserName;
          let chatUserPhoto;
          let chatLatestMessage;
          let chatRead;

          //identify user
          let chatUserId = doc.data().user_id_secondary;

          //get their name
          let docRef = this.afs.collection("users").doc(chatUserId);
          docRef.get().subscribe(snapshot => {
            chatUserName = snapshot.data().name;

            //get their photo
            let fileRef = this.storage.ref(chatUserId + ".jpeg");
            fileRef.getDownloadURL().subscribe(url => {
              chatUserPhoto = url;

              //get lastest message properties
              let docRef =  this.afs.collection('messages', ref => ref.where('user_id_receiver', '==', user.uid.toString()).where('user_id_sender', '==', chatUserId.toString()).orderBy("sent", "desc").limit(1))
              docRef.get().subscribe(messageSnapshot => {
                if (messageSnapshot.empty) {
                  chatLatestMessage = "New convo"
                  chatRead = false;
                } else {
                  messageSnapshot.forEach(doc => {
                    chatLatestMessage = doc.data().message
                    chatRead = doc.data().read
                  })
                }

                //push new chat
                this.chats.push({
                  id: chatId,
                  uid: chatUserId,
                  name: chatUserName,
                  photoURL: chatUserPhoto,
                  latestMessage: chatLatestMessage,
                  read: chatRead
                })
              })
            })
          })
        //entry exists
        } else {
          let chatLatestMessage;
          let chatRead;
          let chatUserId = doc.data().user_id_secondary;

          //get latest message
          this.afs.collection('messages', ref => ref.where('user_id_receiver', '==', user.uid.toString()).where('user_id_sender', '==', chatUserId.toString()).orderBy("sent", "desc").limit(1))
          .get()
          .subscribe(messageSnapshot => {
            if (messageSnapshot.empty) {
              chatLatestMessage = "New convo"
              chatRead = false;
            } else {
              messageSnapshot.forEach(doc => {
                chatLatestMessage = doc.data().message
                chatRead = doc.data().read
              })
            }

            //update latest message and read status
            this.chats[index].latestMessage = chatLatestMessage
            this.chats[index].read = chatRead
          })
        }
      });
    })

    //as secondary
    this.afs.collection('matches', ref => ref.where('user_id_secondary', '==', user.uid.toString()).where('accepted_by_primary', '==', 1).where('accepted_by_secondary', '==', 1))
    .get()
    .subscribe(userSnapshot => {
      //for each match
      userSnapshot.forEach(doc => {

        //match id
        let chatId = doc.id;

        //find if entry already exists
        let found = false;
        let index;
        this.chats.forEach((chat, i)=> {
          if (chat.id == chatId) {
            found = true
            index = i
          }
        })

        if (!found) {
          //temp values
          let chatUserName;
          let chatUserPhoto;
          let chatLatestMessage;
          let chatRead;

          //identify user
          let chatUserId = doc.data().user_id_primary;

          //get their name
          let docRef = this.afs.collection("users").doc(chatUserId);
          docRef.get().subscribe(snapshot => {
            chatUserName = snapshot.data().name;

            //get their photo
            let fileRef = this.storage.ref(chatUserId + ".jpeg");
            fileRef.getDownloadURL().subscribe(url => {
              chatUserPhoto = url;

              let docRef =  this.afs.collection('messages', ref => ref.where('user_id_receiver', '==', user.uid.toString()).where('user_id_sender', '==', chatUserId.toString()).orderBy("sent", "desc").limit(1))
              docRef.get().subscribe(messageSnapshot => {
                if (messageSnapshot.empty) {
                  chatLatestMessage = "New convo"
                  chatRead = false;
                } else {
                  messageSnapshot.forEach(doc => {
                    chatLatestMessage = doc.data().message
                    chatRead = doc.data().read
                  })
                }

                this.chats.push({
                  id: chatId,
                  uid: chatUserId,
                  name: chatUserName,
                  photoURL: chatUserPhoto,
                  latestMessage: chatLatestMessage,
                  read: chatRead
                })
              })
            })
          })
        } else {
          let chatLatestMessage;
          let chatRead;
          let chatUserId = doc.data().user_id_primary;

          //get latest message
          this.afs.collection('messages', ref => ref.where('user_id_receiver', '==', user.uid.toString()).where('user_id_sender', '==', chatUserId.toString()).orderBy("sent", "desc").limit(1))
          .get().subscribe(messageSnapshot => {
            if (messageSnapshot.empty) {
              chatLatestMessage = "New convo"
              chatRead = false;
            } else {
              messageSnapshot.forEach(doc => {
                chatLatestMessage = doc.data().message
                chatRead = doc.data().read
              })
            }

            //update latest message and read status
            this.chats[index].latestMessage = chatLatestMessage
            this.chats[index].read = chatRead
          })
        }
      });
    })

    
  }

  goToMatches(){
    this.navCtrl.setRoot(MatchesPage)
  }

  showChat(uid) {
    //console.log(uid)
    this.navCtrl.push(ChatPage, {uid: uid})
    //console.log("after")
  }

}
