import {Component, Input, OnInit} from '@angular/core';
import {NavParams, NavController} from "ionic-angular";
import {LocationService} from "../../../services/locationService";

@Component({
  selector: 'partner-map',
  templateUrl: 'partner-map.html'
})
export class PartnerMapComponent implements OnInit{

  @Input() partners: any[];

  text: string;
  currentLatitude = LocationService.latitude;
  currentLongitude = LocationService.longitude;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ngOnInit(){
    console.log(this.partners);
    console.log(this.currentLatitude);
    console.log(this.currentLongitude);
  }

  stringToNumber(string){
    return Number(string);
  }
}
