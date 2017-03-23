import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import {LocationData} from "../../../../services/location-data";

declare let device: any;


@Component({
  selector: 'page-partner-detail-map',
  templateUrl: 'partner-detail-map.html'
})
export class PartnerDetailMap {

  travelTimePublic: string;
  travelTimeCar: string;
  travelTimePedestrian: string;

  currentLatitude: number;
  currentLongitude: number;
  locationAvailable: boolean;
  locationExact: boolean;
  starInactive = {
    name: "star-outline",
    color: "grey"
  };
  starActive = {
    name: "star",
    color: "primary"
  };
  star = this.starInactive;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.currentLatitude = parseFloat(LocationData.latitude);
    this.currentLongitude = parseFloat(LocationData.longitude);
    this.locationAvailable = LocationData.locationAvailable;
    this.locationExact = LocationData.locationExact;
    console.log("PartnerDetailMap: ", LocationData.latitude + " " + LocationData.longitude)
  }

  toggleFavorites(){
    if (this.star == this.starActive) {
      this.star = this.starInactive;
    }
    else {
      this.star = this.starActive
    }
  }

  openExternalMapApp(){
    if(device.platform == "Android"){
      window.open("geo:48,11?q=48,11(Hier wollen Sie hin)", '_system', 'location=yes');
    }
    else {
      window.open("http://maps.apple.com/?q=48,11");
    }
  }

  handleTravelTimePublicUpdated(travelTimePublic) {
    this.travelTimePublic = travelTimePublic;
  }
  handleTravelTimeCarUpdated(travelTimeCar) {
    this.travelTimeCar = travelTimeCar;
  }
  handleTravelTimePedestrianUpdated(travelTimePedestrian) {
    this.travelTimePedestrian = travelTimePedestrian;
  }
}
