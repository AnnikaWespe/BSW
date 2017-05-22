import {Component} from '@angular/core';
import {NavParams, NavController, AlertController} from "ionic-angular";
import {Camera} from "@ionic-native/camera";

declare let window: any;

@Component({
  selector: 'picture-screen',
  templateUrl: 'picture-screen.html'
})
export class PictureScreenComponent {

  base64Image: string;
  title = "Einkauf nachtragen";

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private camera: Camera,
              public alertCtrl: AlertController) {
    this.base64Image = navParams.get('base64Image');
  }

  scanReceipt() {
    this.camera.getPicture({
      destinationType: this.camera.DestinationType.DATA_URL,
      targetWidth: 1000,
      targetHeight: 1000
    })
      .then((imageData) => {
        this.base64Image = "data:image/jpeg;base64," + imageData;
      })
      .catch(() => {

      });
  }

  promptNoCameraAccess() {
    let alert = this.alertCtrl.create({
      title: 'Kamerazugriff fehlgeschlagen',
      message: 'Leider darf diese App nicht auf die Kamera zugreifen. Sie können dies in den Appeinstellungen ändern.',
      buttons: [
        {
          text: 'Ok',
          role: 'cancel',
        },
        {
          text: 'Bild aus meiner Galerie auswählen',
          handler: () => {
            console.log('Buy clicked');
          }
        }
      ]
    });
    alert.present();
  }


  sendEmail() {
    window.plugins.socialsharing.shareViaEmail(
      'Sehr geehrte Damen und Herren, bitte tragen Sie meinen Einkauf nach. Meine Mitgliedsnummer lautet ' + localStorage.getItem("mitgliedId") + '.',
      'Vor-Ort Einkauf nacherfassen',
      ['dialog@bsw.de'],
      null,
      null,
      [this.base64Image]
      //onSuccess, // called when sharing worked, but also when the user cancelled sharing via email. On iOS, the callbacks' boolean result parameter is true when sharing worked, false if cancelled. On Android, this parameter is always true so it can't be used). See section "Notes about the successCallback" below.
      //onError // called when sh*t hits the fan
    );
  }


}
