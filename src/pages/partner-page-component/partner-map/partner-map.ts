import {Component, Input, ViewChild, Output, EventEmitter, AfterViewChecked, OnChanges} from '@angular/core';
import {NavParams, NavController} from "ionic-angular";
import {LocationData} from "../../../services/location-data";
import {StyledMapPartnersDirective} from "./styled-map-partners-directive";

@Component({
  selector: 'partner-map',
  templateUrl: 'partner-map.html'
})
export class PartnerMapComponent implements AfterViewChecked, OnChanges{

  text: string;
  currentLatitude = localStorage.getItem("latitude");
  currentLongitude = localStorage.getItem("longitude");
  partnersInList = [];
  partnerListOpen = false;
  scrollTop = 0;
  mapWaitingForResultsValue;

  @Input() partners: any[];
  @Input() get mapWaitingForResults(){
    return this.mapWaitingForResultsValue;
  };
  @Output() scrollToTop = new EventEmitter();
  @Output() mapWaitingForResultsChange = new EventEmitter();

  set mapWaitingForResults(val){
    this.mapWaitingForResultsValue = val;
    this.mapWaitingForResultsChange.emit(this.mapWaitingForResultsValue);
  }


  @ViewChild(StyledMapPartnersDirective) map;
  @ViewChild('partnerList') partnerList;




  constructor(public navCtrl: NavController, public navParams: NavParams) {
    if (localStorage.getItem("locationAvailable") === "true") {
      this.currentLatitude = localStorage.getItem("latitude");
      this.currentLongitude = localStorage.getItem("longitude");
    }
    else {
      this.currentLatitude = "52.5219";
      this.currentLongitude = "13.4132";
    }
  }

  ngOnChanges(){
    console.log("mapWaitingForResults", this.mapWaitingForResults);
  }

  ngAfterViewChecked(){
    let element = this.partnerList.nativeElement;
    try {
      this.partnerList.nativeElement.scrollTop = 0;
    } catch(err) { }
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

  addSpinner(){
    this.mapWaitingForResults = true;
  }

  removeSpinner(){
    this.mapWaitingForResults = false;
  }

  closePartnerList() {
    this.partnerListOpen = false;
    this.map.resizeMap();
  }



}
