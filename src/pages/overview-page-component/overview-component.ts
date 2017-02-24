import {Component, OnInit} from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import {Geolocation} from 'ionic-native';


import {LocationService} from "../../services/locationService";
import {PartnerService} from "../../services/partner-service";
import {PartnerPageComponent} from "../partner-page-component/partner-page-component";


@Component({
  providers: [],
  selector: 'page-overview',
  templateUrl: 'overview-component.html',
})
export class OverviewPageComponent implements OnInit{

  title: string = "Übersicht";
  balance: number = 232;
  bonusThisYear: number = 124;
  heightBalanceBarBonusBarBuffer = ["0vh","0vh", "0vh", "0vh"];
  maxHeightBarInVh = 14;
  location = {latitude: "0", longitude: "0"};
  locationFound = false;
  errorMessage: string;
  waitingForResults = true;
  onlinePartners: any[];
  offlinePartners: any[];
  favoritePartners: any[];
  lastVisitedPartners: any[];




  constructor(public navCtrl: NavController, public navParams: NavParams, private partnerService: PartnerService) {}

  ngOnInit(){
    if(LocationService.locationAvailable){
      this.location.latitude = LocationService.latitude;
      this.location.longitude = LocationService.longitude;
      this.getPartners();
    }
    else {
      this.getLocationData();
    }
  }
  getLocationData() {
    Geolocation.getCurrentPosition().then((position) => {
      this.location.latitude = position.coords.latitude.toFixed(4);
      this.location.longitude = position.coords.longitude.toFixed(4)
      this.locationFound = true;
      this.getPartners();
      LocationService.latitude = this.location.latitude;
      LocationService.longitude = this.location.longitude;
      LocationService.locationExact = true;
      LocationService.locationAvailable = true;
    })
  }

  getPartners() {
    this.partnerService.getPartners(this.location, 0, "")
      .subscribe(
        body => {
          let returnedObject = body.json();
          this.getOnlineAndOfflinePartners(returnedObject);
          this.waitingForResults = false;
        },
        error => this.errorMessage = <any>error);
  }

  getOnlineAndOfflinePartners(returnedObject){
    this.offlinePartners = returnedObject.originalSearchResults.bucketToSearchResult["OFFLINEPARTNER"].contentEntities.slice(0,5);
    this.onlinePartners = returnedObject.originalSearchResults.bucketToSearchResult["ONLINEPARTNER"].contentEntities.slice(0,5);
  }

  showOfflinePartners(){
    this.navCtrl.push(PartnerPageComponent, {filterParameter: "OFFLINEPARTNER"});
  }


  showOnlinePartners(){
    this.navCtrl.push(PartnerPageComponent, {filterParameter: "ONLINEPARTNER"});
  }

  //pure DOM method(s)

  heightBlueBarRedBar(){
    let heightOtherDiv;
    if(this.balance > this.bonusThisYear){
      this.heightBalanceBarBonusBarBuffer[0] = this.maxHeightBarInVh + "vh";
      heightOtherDiv = Math.round((this.bonusThisYear / this.balance) * this.maxHeightBarInVh);
      this.heightBalanceBarBonusBarBuffer[1] =  heightOtherDiv + "vh";
      this.heightBalanceBarBonusBarBuffer[3] =  this.maxHeightBarInVh - heightOtherDiv + "vh";
    }
    else {
      this.heightBalanceBarBonusBarBuffer[1] = this.maxHeightBarInVh + "vh";
      heightOtherDiv = Math.round((this.bonusThisYear / this.balance) * this.maxHeightBarInVh);
      this.heightBalanceBarBonusBarBuffer[0] = heightOtherDiv + "vh";
      this.heightBalanceBarBonusBarBuffer[2] =  this.maxHeightBarInVh - heightOtherDiv + "vh";
    }
    return this.heightBalanceBarBonusBarBuffer;
  }
}
