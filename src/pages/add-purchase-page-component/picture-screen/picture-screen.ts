import {Component, OnDestroy} from '@angular/core';
import {NavParams, NavController, AlertController} from "ionic-angular";
import {Camera} from "@ionic-native/camera";

declare let window: any;

@Component({
  selector: 'picture-screen',
  templateUrl: 'picture-screen.html'
})
export class PictureScreenComponent implements OnDestroy{

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



  sendEmail() {
    window.plugins.socialsharing.shareViaEmail(
      'Sehr geehrte Damen und Herren, bitte tragen Sie meinen Einkauf nach. Meine Mitgliedsnummer lautet ' + localStorage.getItem("mitgliedsnummer") + '.',
      'Vor-Ort Einkauf nacherfassen',
      ['dialog@bsw.de'],
      null,
      null,
      [this.base64Image]
    );
  }

  ngOnDestroy(){
    this.camera.cleanup()
  }


}
