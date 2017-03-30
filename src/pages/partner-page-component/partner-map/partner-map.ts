import {Component, Input, ViewChild, Output, EventEmitter} from '@angular/core';
import {NavParams, NavController} from "ionic-angular";
import {LocationData} from "../../../services/location-data";
import {StyledMapPartnersDirective} from "./styled-map-partners-directive";

@Component({
  selector: 'partner-map',
  templateUrl: 'partner-map.html'
})
export class PartnerMapComponent {

  @Input() partners: any[];
  @Output() scrollToTop = new EventEmitter();


  @ViewChild(StyledMapPartnersDirective) map;


  text: string;
  currentLatitude = LocationData.latitude;
  currentLongitude = LocationData.longitude;
  partnersInList = [];
  partnerListOpen = false;
  scrollTop = 0;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  stringToNumber(string) {
    return Number(string);
  }

  showList(markers = []) {
    this.partnersInList = [];
    this.partnerListOpen = true;
    markers.forEach((marker) => {
      this.partnersInList.push(marker.partner);
    });
  }

  getMapHeight() {
    if (this.partnerListOpen) return "53%"
    else return "100%";
  }

  closePartnerList() {
    this.partnerListOpen = false;
    this.map.resizeMap();
  }

}
