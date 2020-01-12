import { Component, ViewChild, ElementRef } from '@angular/core';
import { NavController, Content, List, NavParams } from 'ionic-angular';

import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFireStorage } from '@angular/fire/storage';
import firebase from 'firebase';

@Component({
  selector: 'page-chat',
  templateUrl: 'chat.html'
})
export class ChatPage {

  @ViewChild(Content) contentArea: Content;
  @ViewChild(List, {read: ElementRef}) chatList: ElementRef;
  
  constructor(
    public navCtrl: NavController,
    public afAuth: AngularFireAuth,
    public afs: AngularFirestore,
    public navParams: NavParams,
    private storage: AngularFireStorage,
    ) {
  }

  private uid: string = this.navParams.get('uid');

  private mutationObserver: MutationObserver;

  public chats: any[] = []

  public myPhoto: string = "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7e/Circle-icons-profile.svg/768px-Circle-icons-profile.svg.png"

  public theirPhoto: string = "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7e/Circle-icons-profile.svg/768px-Circle-icons-profile.svg.png"

  ionViewDidLoad() {
    this.mutationObserver = new MutationObserver((mutations) => {
      setTimeout((promise) => {this.contentArea.scrollToBottom()}, 25);
    });

    this.mutationObserver.observe(this.chatList.nativeElement, {
      childList: true
    });

    //console.log(this.chatList.nativeElement)

    var user = this.afAuth.auth.currentUser;

    if (user) {
      //get photos
      let theirFileRef = this.storage.ref(this.uid + ".jpeg");
      theirFileRef.getDownloadURL().subscribe(url => {
        this.theirPhoto = url;
      })

      let myFileRef = this.storage.ref(user.uid + ".jpeg");
      myFileRef.getDownloadURL().subscribe(url => {
        this.myPhoto = url;
      })
      

      //reciever observable
      this.afs.collection('messages', ref => ref.where('user_id_receiver', '==', user.uid.toString()).where('user_id_sender', '==', this.uid.toString()))
      .snapshotChanges()
      .subscribe(querySnapshot => {
        querySnapshot.forEach(document => {

          const doc = document.payload.doc

          let chatId = doc.id;
          let chatMessage: any = (doc.data() as any).message;
          //let chatRead = doc.data().read;
          let chatTime: any = (doc.data() as any).sent;
          let chatMine = false;

          var data = {
            id : chatId,
            mine: chatMine,
            sent: chatTime,
            message: chatMessage,
          }

          let found = false;
          //let index = -1;

          this.chats.forEach((chat, i) => {
            if (chat.id == chatId) {
              found = true
              //index = i
            }
          })

          if (!found && chatTime != null) {
            this.chats.push(data)
            //console.log(data.sent.seconds * 1000 + data.sent.nanoseconds/100000)
          } else {
           // this.chats[index].sent = chatTime;
          }

          //mark chats as read
          doc.ref.update({read : true});

        });

        this.chats.sort((a,b) => {return this.sorter(a,b)})
        //this.contentArea.scrollToBottom();
        //console.log(this.chats)
      });

      //sender observable
      this.afs.collection('messages', ref => ref.where('user_id_sender', '==', user.uid.toString()).where('user_id_receiver', '==', this.uid.toString()))
      .snapshotChanges()
      .subscribe(querySnapshot => {
        querySnapshot.forEach(document => {

          let chatId = document.payload.doc.id;
          let chatMessage: any = (document.payload.doc.data() as any).message;
          //let chatRead = doc.data().read;
          let chatTime: any = (document.payload.doc.data() as any).sent;
          let chatMine = true;

          var data = {
            id : chatId,
            mine: chatMine,
            sent: chatTime,
            message: chatMessage,
          }

          let found = false;
          //let index = -1;

          this.chats.forEach((chat, i) => {
            if (chat.id == chatId) {
              found = true
              //index = i
            }
          })

          if (!found && chatTime != null) {
            this.chats.push(data)
            //console.log(data.sent.seconds * 1000 + data.sent.nanoseconds/100000)
          } else {
           // this.chats[index].sent = chatTime;
          }

        });

        this.chats.sort((a,b) => {return this.sorter(a,b)})
        //this.contentArea.scrollToBottom();
        //console.log(this.chats)
      });

    }

    

  }

  sorter(a,b) {
    try {
      let aTime = a.sent.seconds * 1000 + a.sent.nanoseconds/100000
      let bTime = b.sent.seconds * 1000 + a.sent.nanoseconds/100000
      return aTime - bTime;
    } catch(error) {
      console.log(error)
      console.log(a)
      console.log(b)

    }
  }

  ionViewDidEnter() {
    //this.contentArea.scrollToBottom();
  }

  messageToSend: string = '';

  sendMessage() {
    var user = this.afAuth.auth.currentUser;

    if (this.messageToSend !== "" && user != null) {
     
      var data = {
        message: this.messageToSend,
        read: false,
        sent: firebase.firestore.FieldValue.serverTimestamp(),
        user_id_receiver: this.uid,
        user_id_sender: user.uid
      };

      this.messageToSend = ""
      
      var setDoc = this.afs.collection('messages').add(data);

    }
  }
  
}
