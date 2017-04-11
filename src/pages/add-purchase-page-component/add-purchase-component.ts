import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Camera } from '@ionic-native/camera';
import {PictureScreenComponent} from "./picture-screen/picture-screen";
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


  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private camera: Camera
  ) {
    if (navParams.get("navParamsAvailable")){
      this.startScreenFirstTime = navParams.get('startScreenFirstTime');
    }
  }


  scanReceipt(){
    this.camera.getPicture({
      destinationType: this.camera.DestinationType.DATA_URL,
      targetWidth: 1000,
      targetHeight: 1000
    })
    .then((imageData) => {
      // imageData is a base64 encoded string
      this.base64Image = "data:image/jpeg;base64," + imageData;
      this.navCtrl.push(PictureScreenComponent, {"base64Image" : this.base64Image});
    })
    .catch((error) => {
      // TODO: what about user related error handling?
      console.error(error);
    });
  }
}

