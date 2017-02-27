import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import {Camera} from 'ionic-native';
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


  constructor(public navCtrl: NavController, public navParams: NavParams) {
    if (navParams.get("navParamsAvailable")){
      this.startScreenFirstTime = navParams.get('startScreenFirstTime');
    }
  }


  scanReceipt(){

    Camera.getPicture({
      destinationType: Camera.DestinationType.DATA_URL,
      targetWidth: 1000,
      targetHeight: 1000
    }).then((imageData) => {
      // imageData is a base64 encoded string
      this.base64Image = "data:image/jpeg;base64," + imageData;
      this.navCtrl.push(PictureScreenComponent, {"base64Image" : this.base64Image});
    }, (err) => {
      console.log(err);
    });
  }

}

