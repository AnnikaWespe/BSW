import {Component} from '@angular/core';
import {AlertController, NavController, NavParams} from 'ionic-angular';
import {Camera, CameraOptions} from '@ionic-native/camera';
import {PictureScreenComponent} from "./picture-screen/picture-screen";
import {GoogleAnalytics} from "@ionic-native/google-analytics";
declare let window: any;

@Component({
  selector: 'add-purchase-page',
  templateUrl: 'add-purchase-component.html'
})
export class AddPurchasePageComponent {

  title: string = "Einkauf nachtragen";
  successMessage: string = "";
  startScreenActive = true;
  startScreenFirstTime = true;
  public base64Image: string;
  const
  optionsImageFromGallery: CameraOptions = {
    sourceType: 0,
    destinationType: this.camera.DestinationType.DATA_URL,
    targetWidth: 1000,
    targetHeight: 1000,
  };


  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private camera: Camera,
              private alertCtrl: AlertController,
              private ga: GoogleAnalytics) {
    if (navParams.get("navParamsAvailable")) {
      this.startScreenFirstTime = navParams.get('startScreenFirstTime');
    }
    if (localStorage.getItem("disallowUserTracking") === "false") {
      this.ga.trackView('Einkauf hinzufügen Screen');
    }
  }


  scanReceipt() {
    this.camera.getPicture({
      destinationType: this.camera.DestinationType.DATA_URL,
      targetWidth: 1000,
      targetHeight: 1000
    })
      .then((imageData) => {
        // imageData is a base64 encoded string
        this.base64Image = "data:image/jpeg;base64," + imageData;
        this.navCtrl.push(PictureScreenComponent, {"base64Image": this.base64Image});
      })
      .catch((error) => {
        console.log("there was an error");
        this.promptNoCameraAccess();
      });
  }

  getPictureFromGallery() {
    this.camera.getPicture(this.optionsImageFromGallery).then((imageData) => {
      this.base64Image = "data:image/jpeg;base64," + imageData;
      this.navCtrl.push(PictureScreenComponent, {"base64Image": this.base64Image});
    })
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
            this.camera.getPicture(this.optionsImageFromGallery).then((imageData) => {
              this.base64Image = "data:image/jpeg;base64," + imageData;
              this.navCtrl.push(PictureScreenComponent, {"base64Image": this.base64Image});
            })
          }
        }
      ]
    });
    alert.present();
  }
}

