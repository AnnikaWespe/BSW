import { Component } from '@angular/core';
import {NavParams, NavController} from "ionic-angular";
import {AddPurchasePageComponent} from "../add-purchase-component";
import {Camera} from "@ionic-native/camera";

declare let window: any;

@Component({
  selector: 'picture-screen',
  templateUrl: 'picture-screen.html'
})
export class PictureScreenComponent {

  base64Image: string;
  title = "Einkauf nachtragen";

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private camera: Camera
  ) {
    this.base64Image = navParams.get('base64Image');
  }

  scanReceipt(){
    this.camera.getPicture({
      destinationType: this.camera.DestinationType.DATA_URL,
      targetWidth: 1000,
      targetHeight: 1000
    })
    .then((imageData) => {
      this.base64Image = "data:image/jpeg;base64," + imageData;
    })
    .catch((err) => {
      console.error(err);
    });
  }

  sendEmail(){
    let options = {
      message: 'Bitte tragen Sie meinen Einkauf nach.',
      subject: 'Einkauf nachtragen',
      files: [this.base64Image],
      chooserTitle: 'Bitte wählen Sie Ihr Emailprogramm:'
    }


    window.plugins.socialsharing.shareWithOptions(options, () => {
        this.navCtrl.setRoot(AddPurchasePageComponent, {"navParamsAvailable": true, "startScreenFirstTime" : false})
      },
      (msg)=>{
        console.log("Sharing failed with message: " + msg);
      });}

}
