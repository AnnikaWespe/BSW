import { Component } from '@angular/core';
import {NavController, NavParams} from "ionic-angular";
import {PartnerPageComponent} from "../partner-page-component";
import {GoogleMapsAPIWrapper} from "angular2-google-maps/core";
import {LocationData} from "../../../services/location-data";
import {LocationService} from "../../../services/location-service";

@Component({
  selector: 'choose-location-manually',
  templateUrl: 'choose-location-manually-component.html'
})
export class ChooseLocationManuallyComponent {

  latitude: string;
  longitude: string;
  cityName: string;
  latitudeCenter = 51.1656;
  longitudeCenter = 10.4515;
  location: {latitude: string, longitude: string};
  markerVisible = true;
  checkButtonVisible = false;
  zoom: number = 6;
  title = 'Standort auswählen';
  locationExact: boolean;

  constructor(public navCtrl: NavController, public navParams: NavParams, private _wrapper: GoogleMapsAPIWrapper, private locationService: LocationService) {
    this.latitude = LocationData.latitude;
    this.longitude = LocationData.longitude;
    this.cityName = LocationData.cityName;
  }

  mapClicked($event: any){
    this.checkButtonVisible = true;
    this.markerVisible = true;
    this.longitude = $event.coords.lng.toFixed(4);
    this.latitude = $event.coords.lat.toFixed(4);
    console.log(this.longitude + " " + this.latitude);
    this.locationExact = true;
    this.setLocationData();
  }

  setLocationData(){
    LocationData.latitude = this.latitude;
    LocationData.longitude = this.longitude;
    LocationData.locationManuallyChosen = true;
  }

  inputToSuggestions(){
    this.locationExact = false;
  }
  saveLocation(){
    console.log(this.navParams.data);
    this.navCtrl.setRoot(PartnerPageComponent, this.navParams.data);
  }

  parseFloat(string){
    return parseFloat(string);
  }


}
