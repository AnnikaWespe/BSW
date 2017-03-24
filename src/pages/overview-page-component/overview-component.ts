import {Component, OnInit} from '@angular/core';
import {NavController, NavParams} from 'ionic-angular';
import {Geolocation} from 'ionic-native';


import {LocationData} from "../../services/location-data";
import {PartnerService} from "../../services/partner-service";
import {PartnerPageComponent} from "../partner-page-component/partner-page-component";
import {LocationService} from "../../services/location-service";


@Component({
  providers: [],
  selector: 'page-overview',
  templateUrl: 'overview-component.html',
})
export class OverviewPageComponent implements OnInit {

  title: string = "Übersicht";
  balance: number = 10;
  bonusThisYear: number = 1;
  heightBalanceBarBonusBarBuffer = ["0vh", "0vh", "0vh", "0vh"];
  maxHeightBarInVh = 14;
  location = {latitude: "0", longitude: "0"};
  locationFound = false;
  errorMessage: string;
  waitingForResults = true;
  onlinePartners: any[];
  offlinePartners: any[];
  favoritePartners: any[];
  lastVisitedPartners: any[];
  searchInterfaceOpen = false;

  constructor(public navCtrl: NavController, public navParams: NavParams, private partnerService: PartnerService, private locationService: LocationService) {
  }

  public ngAfterViewChecked() {
    this.setFocus();
  }

  ngOnInit() {
    this.locationService.getLocation().subscribe();
    this.location.latitude = LocationData.latitude;
    this.location.longitude = LocationData.longitude;
    this.getPartners();
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

  getOnlineAndOfflinePartners(returnedObject) {
    this.offlinePartners = returnedObject.originalSearchResults.bucketToSearchResult["OFFLINEPARTNER"].contentEntities.slice(0, 5);
    this.onlinePartners = returnedObject.originalSearchResults.bucketToSearchResult["ONLINEPARTNER"].contentEntities.slice(0, 5);
  }

  showOfflinePartners() {
    this.navCtrl.push(PartnerPageComponent, {activeFilter: "localPartners", title: "Vor Ort Partner"});
  }


  showOnlinePartners() {
    this.navCtrl.push(PartnerPageComponent, {activeFilter: "onlinePartners", title: "Online Partner"});
  }

  loadPartnerPage(searchTerm) {
    this.navCtrl.setRoot(PartnerPageComponent, {activeFilter: "allPartners", searchTerm: searchTerm, title: searchTerm})
  }

  //pure DOM method(s)

  heightBlueBarRedBar() {
    let heightOtherDiv;
    if (this.balance > this.bonusThisYear) {
      this.heightBalanceBarBonusBarBuffer[0] = this.maxHeightBarInVh + "vh";
      heightOtherDiv = Math.max(Math.round((this.bonusThisYear / this.balance) * this.maxHeightBarInVh), 1);
      this.heightBalanceBarBonusBarBuffer[1] = heightOtherDiv + "vh";
      this.heightBalanceBarBonusBarBuffer[3] = this.maxHeightBarInVh - heightOtherDiv + "vh";
    }
    else {
      this.heightBalanceBarBonusBarBuffer[1] = this.maxHeightBarInVh + "vh";
      heightOtherDiv = Math.max(Math.round((this.balance / this.bonusThisYear) * this.maxHeightBarInVh), 1);
      this.heightBalanceBarBonusBarBuffer[0] = heightOtherDiv + "vh";
      this.heightBalanceBarBonusBarBuffer[2] = this.maxHeightBarInVh - heightOtherDiv + "vh";
    }
    return this.heightBalanceBarBonusBarBuffer;
  }

  private setFocus() {
    let searchInputField = document.getElementById('mySearchInputField');
    if (searchInputField) {
      searchInputField.focus();
    }
  }
}
