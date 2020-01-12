import { Component, ElementRef, ViewChild } from '@angular/core';
import { NavController } from 'ionic-angular';

import { Camera, CameraOptions } from '@ionic-native/camera';

import { AngularFireStorage } from '@angular/fire/storage';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';

import { finalize } from 'rxjs/operators';
import { Observable } from 'rxjs';

import { AlertController } from 'ionic-angular';
import { InterestsPage } from '../interests/interests';
import { MatchesPage } from '../matches/matches';



@Component({
  selector: 'page-bio',
  templateUrl: 'bio.html'
})


export class BioPage {


  
  constructor(
    public navCtrl: NavController,
    private camera: Camera,
    private storage: AngularFireStorage,
    public afAuth: AngularFireAuth,
    public alert: AlertController,
    public afs: AngularFirestore,
    ) {
  }

  bioValue: string = "";

  optionsCamera: CameraOptions = {
    quality: 100,
    sourceType: -1,
    destinationType: this.camera.DestinationType.DATA_URL,
    encodingType: this.camera.EncodingType.JPEG,
    mediaType: this.camera.MediaType.PICTURE,
    correctOrientation: true,
    targetHeight: 1080,
    targetWidth: 1080,
    cameraDirection: 1
  }
  
  downloadURL: Observable<string>;

  description: string = "Add a photo:"

  pictureChanged: boolean = false;
  bioChanged: boolean = false;

  @ViewChild('pwaphoto') pwaphoto: ElementRef;

  openPWAPhotoPicker() {
    if (this.pwaphoto == null) {
      return;
    }

    this.pwaphoto.nativeElement.click();
  }

  uploadPWA() {

    if (this.pwaphoto == null) {
      return;
    }

    const fileList: FileList = this.pwaphoto.nativeElement.files;

    if (fileList && fileList.length > 0) {
      this.firstFileToBase64(fileList[0]).then((result: string) => {
        let imgURI = result;
        
        console.log(result);

        var user = this.afAuth.auth.currentUser;

        if (user != null) {

          const filePath = user.uid + ".jpeg";
          const ref = this.storage.ref(filePath);

          var metadata = {
            contentType: 'image/jpeg',
          };
        
          var task = ref.put(imgURI, metadata)
          
          console.log(task)

          task.percentageChanges().subscribe(percent => {
            this.description = "Uploading: " + Math.round(percent).toString() + "%";
          })
          
          task.snapshotChanges().pipe(
          finalize(() => {
            ref.getDownloadURL().subscribe(uploadURL => {
              //console.log('Profile Photo->:' + uploadURL);

              user.updateProfile({
                photoURL: uploadURL,
              })

              this.showAlert("Success!", "Photo uploaded!");
              this.description = "Add a photo:"
              this.pictureChanged = true;

            });
          })
          )
          .subscribe();

        }

      }, (err: any) => {
        // Ignore error, do nothing
        console.log(err)
      });
    }
  }

  private firstFileToBase64(fileImage: File): Promise<{}> {
    return new Promise((resolve, reject) => {
      let fileReader: FileReader = new FileReader();
      if (fileReader && fileImage != null) {
        fileReader.readAsDataURL(fileImage);
        fileReader.onload = () => {
          resolve(fileReader.result);
        };

        fileReader.onerror = (error) => {
          reject(error);
        };
      } else {
        reject(new Error('No file found'));
      }
    });
  }

  /*getPicture(source) {

    if (source == 1) {
      this.optionsCamera.sourceType = this.camera.PictureSourceType.CAMERA
    } else {
      this.optionsCamera.sourceType = this.camera.PictureSourceType.PHOTOLIBRARY
    }

    var user = this.afAuth.auth.currentUser;

    if (user != null) {
      this.camera.getPicture(this.optionsCamera).then((imageData) => {
    
        const filePath = user.uid + ".jpeg";
        const ref = this.storage.ref(filePath);

        var metadata = {
          contentType: 'image/jpeg',
        };

       
        var task = ref.putString(imageData, "base64", metadata);

        task.percentageChanges().subscribe(percent => {
          this.description = "Uploading: " + Math.round(percent).toString() + "%";
        })
        
        task.snapshotChanges().pipe(
        finalize(() => {
          ref.getDownloadURL().subscribe(uploadURL => {
            //console.log('Profile Photo->:' + uploadURL);

            user.updateProfile({
              photoURL: uploadURL,
            })

            this.showAlert("Success!", "Photo uploaded!");
            this.description = "Add a photo:"
            this.pictureChanged = true;

          });
        })
        )
        .subscribe();

      }, (err) => {
        
      });
    } else {
      this.showAlert("Error!", "Not signed in!");
    }
  }*/
  
  bioChange() {
    this.bioChanged = true;
  }

  continue() {
    if (this.bioChanged) {
      var user = this.afAuth.auth.currentUser;

      if (user != null) {
        var setDoc = this.afs.collection('users').doc(user.uid).update({bio: this.bioValue});
        //console.log(this.bioValue);
        this.showAlert("Success!", "Updated bio!");
      } else {
        throw "User not logged in!"
      }
    } else if (this.pictureChanged) {
      this.showAlert("Success!", "Bio unchanged")
    } else {
      this.showAlert("Success!", "No changes were made")
    }

    this.navCtrl.setRoot(MatchesPage)
  }

  
  ionViewDidLoad(){
    var user = this.afAuth.auth.currentUser;
    
    var docRef = this.afs.collection("users").doc(user.uid);

    docRef.get().subscribe(snapshot => {
      this.bioValue = snapshot.data().bio;
      //console.log(snapshot.data());
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

