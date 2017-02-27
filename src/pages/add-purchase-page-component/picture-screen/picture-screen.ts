import { Component } from '@angular/core';
import {NavParams, NavController} from "ionic-angular";
import {AddPurchasePageComponent} from "../add-purchase-component";
import {Camera} from "ionic-native";

declare let window: any;

/*
  Generated class for the PictureScreen component.

  See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
  for more info on Angular 2 Components.
*/
@Component({
  selector: 'picture-screen',
  templateUrl: 'picture-screen.html'
})
export class PictureScreenComponent {

  base64Image: string;
  title = "Einkauf nachtragen";

  constructor(public navCtrl: NavController, public navParams: NavParams){
    this.base64Image = navParams.get('base64Image');
  }

  scanReceipt(){
    Camera.getPicture({
      destinationType: Camera.DestinationType.DATA_URL,
      targetWidth: 1000,
      targetHeight: 1000
    }).then((imageData) => {
      // imageData is a base64 encoded string
      this.base64Image = "data:image/jpeg;base64," + imageData;
    }, (err) => {
      console.log(err);
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
        this.navCtrl.push(AddPurchasePageComponent, {"navParamsAvailable": true, "startScreenFirstTime" : false})
      },
      (msg)=>{
        console.log("Sharing failed with message: " + msg);
      });}

}
