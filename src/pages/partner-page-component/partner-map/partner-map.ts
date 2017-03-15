import {Component, Input } from '@angular/core';
import {NavParams, NavController} from "ionic-angular";
import {LocationService} from "../../../services/locationService";

@Component({
  selector: 'partner-map',
  templateUrl: 'partner-map.html'
})
export class PartnerMapComponent{

  @Input() partners: any[];


  text: string;
  currentLatitude = LocationService.latitude;
  currentLongitude = LocationService.longitude;
  partnersInList = [];
  partnerListOpen = false;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  stringToNumber(string){
    return Number(string);
  }

  showList(markers){
    this.partnersInList = [];
    this.partnerListOpen = true;
    markers.forEach((marker)=>{
      this.partnersInList.push(marker.partner);
    });
  }
}
