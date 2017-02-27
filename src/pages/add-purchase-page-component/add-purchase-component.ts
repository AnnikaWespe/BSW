import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import {Camera} from 'ionic-native';
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


  constructor(public navCtrl: NavController, public navParams: NavParams) {}

  scanRecipe(){
    Camera.getPicture({
      destinationType: Camera.DestinationType.DATA_URL,
      targetWidth: 1000,
      targetHeight: 1000
    }).then((imageData) => {
      // imageData is a base64 encoded string
      this.base64Image = "data:image/jpeg;base64," + imageData;
      this.startScreenActive = false;
    }, (err) => {
      console.log(err);
    });
  }
  sendEmail(){
    let options = {
      message: 'Bitte tragen Sie meinen Einkauf nach.',
      subject: 'Einkauf nachtragen',
      files: [this.base64Image],
      chooserTitle: 'Bitte wählen Sie Ihr Emailprogramm'
    }


    window.plugins.socialsharing.shareWithOptions(options, () => {
      this.successMessage = "Danke, wir werden uns umgehend kümmern. Sie können jetzt weitere Kassenzettel einscannen."
    },
      (msg)=>{
        console.log("Sharing failed with message: " + msg);
      });
    this.startScreenFirstTime = false;
  }

}

