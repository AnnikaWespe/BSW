import {Component, OnInit, OnDestroy} from '@angular/core';
import {NavController, NavParams} from 'ionic-angular';
import {Geolocation} from 'ionic-native';


import {LocationData} from "../../services/location-data";
import {PartnerService} from "../../services/partner-service";
import {PartnerPageComponent} from "../partner-page-component/partner-page-component";
import {LocationService} from "../../services/location-service";
import {FilterData} from "../../services/filter-data";


@Component({
  providers: [],
  selector: 'page-overview',
  templateUrl: 'overview-component.html',
})
export class OverviewPageComponent implements OnInit, OnDestroy {

  title: string = "Übersicht";
  balance: number = 10;
  bonusThisYear: number = 1;
  heightBalanceBarBonusBarBuffer = ["0vh", "0vh", "0vh", "0vh"];
  maxHeightBarInVh = 14;
  location = {latitude: "0", longitude: "0"};
  locationAvailable = false;
  errorMessage: string;
  waitingForResults = true;
  onlinePartners: any[];
  offlinePartners: any[];
  favoritePartners: any[];
  lastVisitedPartners: any[];
  searchInterfaceOpen = false;

  getPartnersSubscription: any;
  getLocationSubscription: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, private partnerService: PartnerService, private locationService: LocationService) {
    this.getLocationSubscription = locationService.getLocation().subscribe(
      (object) => {
        if(object.locationFound == true){
          this.location.latitude = object.lat;
          this.location.longitude = object.lon;
          this.getPartners();
          this.locationAvailable = true;
        }
        else{
          console.log("no location found");
          this.getPartners();
        }
      }
    )
  }


  public ngAfterViewChecked() {
    this.setFocus();
  }

  ngOnInit() {
    this.locationService.getLocation();
  }

  ngOnDestroy(){
    if(this.getPartnersSubscription){
      this.getPartnersSubscription.unsubscribe();
    };
    if(this.getLocationSubscription){
      this.getLocationSubscription.unsubscribe();
    }
  }

  getPartners() {
    this.getPartnersSubscription = this.partnerService.getPartners(this.location, 0, "")
      .subscribe(
        body => {
          let returnedObject = body.json();
          this.getOnlineAndOfflinePartners(returnedObject);
          this.waitingForResults = false;
        },
        error => this.errorMessage = <any>error);
  }

  getOnlineAndOfflinePartners(returnedObject) {
    this.onlinePartners = returnedObject.originalSearchResults.bucketToSearchResult["ONLINEPARTNER"].contentEntities.slice(0, 5);
    let offlinePartnerArray = returnedObject.originalSearchResults.bucketToSearchResult["OFFLINEPARTNER"].contentEntities;
    if( offlinePartnerArray){this.offlinePartners = offlinePartnerArray.slice(0, 5)}
  }

  showOfflinePartners() {
  FilterData.showLocalPartners = true;
  FilterData.showOnlinePartners = false;
  FilterData.showOnlyPartnersWithCampaign = false;
  FilterData.title = "Vor Ort Partner";
    this.navCtrl.push(PartnerPageComponent, {});
  }


  showOnlinePartners() {
    FilterData.showLocalPartners = false;
    FilterData.showOnlinePartners = true;
    FilterData.showOnlyPartnersWithCampaign = false;
    FilterData.title = "Online Partner";
    this.navCtrl.push(PartnerPageComponent, {});
  }

  loadPartnerPage(searchTerm) {
    FilterData.showLocalPartners = true;
    FilterData.showOnlinePartners = true;
    FilterData.showOnlyPartnersWithCampaign = false;
    FilterData.title = searchTerm;
    this.navCtrl.setRoot(PartnerPageComponent, {type: "searchPageComponent", searchTerm: searchTerm})
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
