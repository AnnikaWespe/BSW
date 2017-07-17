import {Component, Input, ViewChild, Output, EventEmitter, AfterViewChecked, OnChanges, OnInit} from '@angular/core';
import {NavParams, NavController} from "ionic-angular";
import {StyledMapPartnersDirective} from "./styled-map-partners-directive";
import {GoogleAnalytics} from "@ionic-native/google-analytics";
import {PartnerDetailComponent} from "../partner-detail-component/partner-detail-component";


@Component({
  selector: 'partner-map',
  templateUrl: 'partner-map.html'
})
export class PartnerMapComponent implements AfterViewChecked{

  text: string;
  currentLatitude = localStorage.getItem("latitude");
  currentLongitude = localStorage.getItem("longitude");
  partnersInList = [];
  partnerListOpen = false;
  partners: any[];
  scrollTop = 0;
  locationExact = false;

  @Input() partnersLong: any[];
  @Input() justPartnersWithCampaign$: EventEmitter<boolean>;
  @Input() justPartnersWithCampaign: boolean;
  @Input() searchTerm$: EventEmitter<string>;
  @Input() searchTerm: string;


  @Output() scrollToTop = new EventEmitter();
  @Output() mapWaitingForResultsChange = new EventEmitter();
  @Output() onListUpdated = new EventEmitter();




  @ViewChild(StyledMapPartnersDirective) map;
  @ViewChild('partnerList') partnerList;




  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private ga: GoogleAnalytics) {
    if (localStorage.getItem("disallowUserTracking") === "false") {
      this.ga.trackView('Kartenansicht Partner Screen')
    }
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
    if (this.partnerListOpen) return "53vh"
    else return "100vh";
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

  showPartner(partner = 0) {
    this.navCtrl.push(PartnerDetailComponent, {partner: partner})
  }


}
