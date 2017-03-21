import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import {LocationService} from "../../../../services/location-service";

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
    this.currentLatitude = parseFloat(LocationService.latitude);
    this.currentLongitude = parseFloat(LocationService.longitude);
    this.locationAvailable = LocationService.locationAvailable;
    this.locationExact = LocationService.locationExact;
    console.log("PartnerDetailMap: ", LocationService.latitude + " " + LocationService.longitude)
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
      window.open("http://maps.apple.com/?ll=48,11");
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
