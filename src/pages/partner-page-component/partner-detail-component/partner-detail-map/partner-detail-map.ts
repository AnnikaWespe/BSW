import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import {LocationService} from "../../../../app/locationService";


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
    console.log("you clicked the star");
    if (this.star == this.starActive) {this.star = this.starInactive;}
    else {this.star = this.starActive};
  }
}
