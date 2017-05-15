import {Component, Input, ViewChild, Output, EventEmitter, AfterViewChecked, OnChanges, OnInit} from '@angular/core';
import {NavParams, NavController} from "ionic-angular";
import {LocationData} from "../../../services/location-data";
import {StyledMapPartnersDirective} from "./styled-map-partners-directive";
import { Content } from 'ionic-angular';


@Component({
  selector: 'partner-map',
  templateUrl: 'partner-map.html'
})
export class PartnerMapComponent implements AfterViewChecked, OnChanges, OnInit{

  text: string;
  currentLatitude = localStorage.getItem("latitude");
  currentLongitude = localStorage.getItem("longitude");
  partnersInList = [];
  partnerListOpen = false;
  partners: any[];
  scrollTop = 0;
  mapWaitingForResultsValue;
  locationExact = false;

  @Input() partnersLong: any[];
  @Input() get mapWaitingForResults(){
    return this.mapWaitingForResultsValue;
  };
  @Output() scrollToTop = new EventEmitter();
  @Output() mapWaitingForResultsChange = new EventEmitter();
  @Output() onListUpdated = new EventEmitter();


  set mapWaitingForResults(val){
    this.mapWaitingForResultsValue = val;
    this.mapWaitingForResultsChange.emit(this.mapWaitingForResultsValue);
  }


  @ViewChild(StyledMapPartnersDirective) map;
  @ViewChild('partnerList') partnerList;




  constructor(public navCtrl: NavController, public navParams: NavParams) {
    if (localStorage.getItem("locationExact") === "true") {
      this.currentLatitude = localStorage.getItem("latitude");
      this.currentLongitude = localStorage.getItem("longitude");
      this.locationExact = true;
    }
    else {
      this.currentLatitude = "52.5219";
      this.currentLongitude = "13.4132";
    }
  }

  ngOnChanges(){
    console.log("mapWaitingForResults", this.mapWaitingForResults);
  }

  ngOnInit(){
    this.partners = this.partnersLong.slice(0,50);
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
    let newPartners = markers.map((marker)=>{return marker.partner});
    this.partnersInList = newPartners;
    this.partnerListOpen = true;
    this.onListUpdated.emit();
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

  unsubscribeFromGetPartnersRequest(){
    this.map.unsubscribeFromGetPartnersRequest();
  }

  setParameterOnlyPartnersWithCampaign(boolean){
    this.map.setParameterOnlyPartnersWithCampaign(boolean)
  }

  getPartnersWithSearchTerm(searchTerm){
    this.map.getPartnersWithSearchTerm(searchTerm);
  }


}
