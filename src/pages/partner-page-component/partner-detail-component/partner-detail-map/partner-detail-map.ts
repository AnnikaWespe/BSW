import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import {LocationService} from "../../../../app/locationService";

declare let device: any;



@Component({
  selector: 'page-partner-detail-map',
  templateUrl: 'partner-detail-map.html'
})
export class PartnerDetailMap {

  currentLatitude: number;
  currentLongitude: number;
  locationFound: boolean;
  locationExact: boolean;
  starInactive: {} = {
    name: "star-outline",
    color: "grey"
  };
  starActive: {} = {
  name: "star",
  color: "primary"
  };
  star: {} = this.starInactive;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.currentLatitude = parseFloat(LocationService.latitude);
    this.currentLongitude = parseFloat(LocationService.longitude);
    this.locationFound = LocationService.locationFound;
    this.locationExact = LocationService.locationExact;
    console.log(LocationService.latitude + " " + LocationService.longitude)
  }
  toggleFavorites(){
    if (this.star == this.starActive) {this.star = this.starInactive;}
    else {this.star = this.starActive};
  }
  openExternalMapApp(){
    if(device.platform == "Android"){
      window.open("geo:48,11?q=48,11(Hier wollen Sie hin)", '_system', 'location=yes');
    }
    else {
      window.open("http://maps.apple.com/?ll=48,11");
    }
  }

}

// ,
