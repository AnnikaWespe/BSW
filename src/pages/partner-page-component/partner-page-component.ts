import {Component, AfterViewChecked, ViewChild, OnDestroy} from '@angular/core';
import {NavController, NavParams, Content} from 'ionic-angular';

import {PartnerService} from "../../services/partner-service";
import {ChooseLocationManuallyComponent} from "./choose-location-manually/choose-location-manually-component";
import {AlertController} from 'ionic-angular';
import {PartnerDetailComponent} from "./partner-detail-component/partner-detail-component";
import {LocationService} from "../../services/location-service";
import {style, state, trigger, transition, animate} from "@angular/animations";

@Component({
  selector: 'partner-page-component',
  templateUrl: 'partner-page-component.html',
  animations: [trigger('show', [state('false', style({
    height: '0vh'
  })),
  state('true', style({
    height: '84vh'
  })),
    transition('false <=> true', animate('500ms'))
  ])]
})
export class PartnerPageComponent implements AfterViewChecked, OnDestroy {
  @ViewChild(Content) content: Content;
  title = "Partner";
  mode = "Observable";
  getPartnersSubscription: any;
  getLocationNameSubscription: any;
  getLocationSubscription: any;

  location = {latitude: "0", longitude: "0"};

  showCustomBackButton = false;
  showDropdown = [false, false, false];
  showDropdownForAnimation = ["false", "false"];


  waitingForResults: boolean = true;
  mapWaitingForResults;
  waitingForGPSSignal = false;

  errorMessage: string;

  showMap = false;
  showMapIcon = false;

  displayedPartners = [];

  offlinePartners = [];
  onlinePartners = [];
  allPartners = [];
  partnersWithCampaign = [];
  resetPartnersArray: boolean = true;
  moreDataCanBeLoaded = true;
  bucket: number = 0;
  searchTerm = "";

  showOfflinePartners = false;
  showOnlinePartners = false;
  showOnlyPartnersWithCampaign = false;
  pageType: string;
  onlinePartnerPageComponent = false;
  offlinePartnerPageComponent = false;
  searchPageComponent = false;

  getLocationFromGPSEnabled = false;
  cityName;

  searchInterfaceOpen: boolean = false;

  public ngAfterViewChecked() {
    this.setFocus();
  }

  ngOnDestroy() {
    if (this.getLocationSubscription) {
      this.getLocationSubscription.unsubscribe();
    }
    if (this.getPartnersSubscription) {
      this.getPartnersSubscription.unsubscribe();
    }
  }

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private partnerService: PartnerService,
              public alertCtrl: AlertController,
              public locationService: LocationService) {

    let pageType = navParams.get("type");
    this[pageType] = true;
    this.pageType = pageType;
    this.searchTerm = navParams.get("searchTerm") || "";
    this.getLocationFromGPSEnabled = (localStorage.getItem("getLocationFromGPSEnabled") === "true");
    this.cityName = localStorage.getItem("cityName") || "Berlin";
    this.setParameters();
  }

  setParameters() {
    this.showOnlyPartnersWithCampaign = this.navParams.get("showOnlyPartnersWithCampaign") || false;
    if (this.offlinePartnerPageComponent) {
      this.showOfflinePartners = true;
      this.displayedPartners = this.offlinePartners;
      this.title = "Vor Ort Partner";
      this.checkIfGPSEnabled();
    }
    if (this.onlinePartnerPageComponent) {
      this.showOnlinePartners = true;
      this.displayedPartners = this.onlinePartners;
      this.title = "Online Partner";
      this.getPartners();
    }
    if (this.searchPageComponent) {
      this.showOnlinePartners = this.navParams.get("showOnlinePartners") || true;
      this.showOfflinePartners = this.navParams.get("showOfflinePartners") || true;
      this.displayedPartners = this.allPartners;
      this.title = this.searchTerm;
      this.checkIfGPSEnabled();
    }
  }


  checkIfGPSEnabled() {
    if (this.getLocationFromGPSEnabled) {
      this.getLocationSubscription = this.locationService.getLocation().subscribe(
        (object) => {
          if (object.locationFound == true) {
            this.location.latitude = object.lat;
            this.location.longitude = object.lon;
            this.getPartners();
          }
          else {
            localStorage.setItem("getLocationFromGPSEnabled", "false");
            this.getLocationFromGPSEnabled = false;
            this.getManuallySetLocationData();
          }
        }
      )
    }
    else {
      this.getManuallySetLocationData();
      this.getPartners();
    }
  }

  getManuallySetLocationData() {
    if (localStorage.getItem("locationAvailable") === "true") {
      this.location.latitude = localStorage.getItem("latitude");
      this.location.longitude = localStorage.getItem("longitude");
    }
    else {
      this.location.latitude = "52.5219";
      this.location.longitude = "13.4132";
    }
  }

  showPromptGPSDisabled() {
    let prompt = this.alertCtrl.create({
      title: 'Leider darf diese App nicht auf Ihren Standort zugreifen.',
      message: "Sie können dies in den Appeinstellungen ändern, oder Ihren Standort manuell anpassen.",
      buttons: [
        {
          text: 'OK',
          handler: data => {
          }
        }
      ]
    });
    prompt.present();
  }

  getPartnersWithSearchTerm(searchTerm) {
    this.searchInterfaceOpen = false;
    this.showCustomBackButton = true;
    this.searchTerm = searchTerm + " ";
    this.getPartners();
    this.title = searchTerm;
  }

  getPartners() {
    console.log(this.location, this.bucket, this.searchTerm);
    if (this.resetPartnersArray == true) {
      this.allPartners = [];
      this.onlinePartners = [];
      this.offlinePartners = [];
      this.partnersWithCampaign = [];
      this.bucket = 0;
      this.waitingForResults = true;
    }
    this.getPartnersSubscription = this.partnerService.getPartners(this.location, this.bucket, this.searchTerm)
      .subscribe(
        body => {
          let returnedObject = body.json();
          this.getDifferentCategories(returnedObject);
          if (!returnedObject.contentEntities) {
            this.moreDataCanBeLoaded = false;
          }
        },
        error => this.errorMessage = <any>error);
  }

  getDifferentCategories(returnedObject) {
    this.allPartners = this.allPartners.concat(returnedObject.contentEntities);
    this.offlinePartners = this.offlinePartners.concat(returnedObject.originalSearchResults.bucketToSearchResult["OFFLINEPARTNER"].contentEntities);
    this.onlinePartners = this.onlinePartners.concat(returnedObject.originalSearchResults.bucketToSearchResult["ONLINEPARTNER"].contentEntities);
    this.getDisplay();
    this.waitingForResults = false;
  }

  filterButtonPushed() {
    if (this.showOfflinePartners) {
      this.waitingForResults = true;
      this.mapWaitingForResults = true;
      this.checkIfGPSEnabled();
    }
    else {
      this.waitingForResults = true;
      this.getDisplay();
    }
    this.showDropdown = [false, false, false];
    this.showDropdownForAnimation = ["false", "false"];
  }

  getDisplay() {
    if (!this.showOfflinePartners && !this.showOnlinePartners) {
      this.askForValidCategories();
      return;
    }
    if (this.showOfflinePartners && !this.showOnlinePartners) {
      this.title = this.searchTerm || "Vor Ort Partner";
      localStorage.setItem("title", "Vor Ort Partner");
      this.filterCampaignPartners(this.offlinePartners);
    }
    else if (!this.showOfflinePartners && this.showOnlinePartners) {
      this.title = this.searchTerm || "Online Partner";
      localStorage.setItem("title", "Online Partner");
      this.filterCampaignPartners(this.onlinePartners);
    }
    else if (this.showOfflinePartners && this.showOnlinePartners) {
      this.title = this.searchTerm || "Alle Partner";
      localStorage.setItem("title", "Alle Partner");
      this.filterCampaignPartners(this.allPartners)
    }
  }


  chooseLocationManually() {
    event.stopPropagation();
    this.navCtrl.push(ChooseLocationManuallyComponent, {
      type: this.pageType,
      showOfflinePartners: this.showOfflinePartners,
      showOnlinePartners: this.showOnlinePartners,
      showOnlyPartnersWithCampaign: this.showOnlyPartnersWithCampaign,
    });
    this.showDropdown = [false, false, false];
    this.showDropdownForAnimation = ["false", "false"];
  }


  showPartner(partner = 0) {
    this.navCtrl.push(PartnerDetailComponent, {
      type: this.pageType,
      showOfflinePartners: this.showOfflinePartners,
      showOnlinePartners: this.showOnlinePartners,
      showOnlyPartnersWithCampaign: this.showOnlyPartnersWithCampaign,
    })
  }


  filterCampaignPartners(displayedPartners) {
    this.waitingForResults = false;
    if (this.showOnlyPartnersWithCampaign) {
      let partnersWithCampaign = [];
      this.title = this.searchTerm || "Partner mit Aktionen";
      for (let partner of displayedPartners) {
        if (partner && partner.hasCampaign) {
          partnersWithCampaign.push(partner);
        }
        else if (partner == null) {
          this.moreDataCanBeLoaded = false;
          this.displayedPartners = partnersWithCampaign;
          return;
        }
      }
      if (partnersWithCampaign.length < 7) {
        this.resetPartnersArray = false;
        this.bucket += 50;
        this.getPartners();
      }
      this.displayedPartners = partnersWithCampaign;
    }
    else {
      this.displayedPartners = displayedPartners
    }
  }

  askForValidCategories() {
    let prompt = this.alertCtrl.create({
      title: 'Bitte wählen Sie entweder "Vor-Ort-Partner" oder "Online Partner" aus',
      buttons: [
        {
          text: 'OK',
          handler: data => {
          }
        }
      ]
    });
    prompt.present();
    this.showDropdown = [true, false, true];
    this.showDropdownForAnimation = ["true", "false"];
  }

  toggleMapAndList() {
    this.showMap = !this.showMap;
    this.mapWaitingForResults = true;
    this.showDropdown = [false, false, false];
    this.showDropdownForAnimation = ["false", "false"];
  }

  toggleGetLocationFromGPSEnabled() {
    let newValueGetLocationFromGPSEnabled = !this.getLocationFromGPSEnabled;
    if (newValueGetLocationFromGPSEnabled) {
      this.waitingForGPSSignal = true;
      this.getLocationSubscription = this.locationService.getLocation().subscribe(
        (object) => {
          if (object.locationFound == true) {
            this.waitingForGPSSignal = false;
            this.location.latitude = object.lat;
            this.location.longitude = object.lon;
            this.getLocationFromGPSEnabled = true;
            localStorage.setItem("getLocationFromGPSEnabled", "true");
            this.getLocationNameSubscription = this.locationService.getLocationName(this.location.latitude, this.location.longitude).subscribe((cityName) => {
              this.cityName = cityName
            })
          }
          else {
            this.showPromptGPSDisabled();
            this.waitingForGPSSignal = false;
          }
        }
      )
    }
    else {
      localStorage.setItem("getLocationFromGPSEnabled", "false");
      this.getLocationFromGPSEnabled = false;
      this.getManuallySetLocationData();
    }
  }

//pure DOM methods

  private setFocus() {
    let searchInputField = document.getElementById('mySearchInputField');
    if (searchInputField) {
      searchInputField.focus();
    }
  }

  hideDropdown() {
    this.showDropdown = [false, false, false];
    this.showDropdownForAnimation = ["false", "false"];
  }


  toggleVisibilityDropdowns(position) {
    let isVisible = this.showDropdown[position];
    let anythingVisible = this.showDropdown[2];
    this.showDropdown = [false, false, false];
    this.showDropdown[position] = !isVisible;
    this.showDropdown[2] = !anythingVisible;
    this.showDropdownForAnimation = [this.showDropdown[0].toString(), this.showDropdown[1].toString()];
    console.log(this.showDropdownForAnimation);
  }

  closeSearchInterface() {
    this.searchInterfaceOpen = false;
    if (this.searchTerm) {
      this.searchTerm = "";
      this.resetPartnersArray = true;
      this.getPartners();
    }
    this.searchTerm = "";
    this.showDropdown = [false, false, false];
    this.showDropdownForAnimation = ["false", "false"];
    this.title = localStorage.getItem("title");
    if (this.searchPageComponent) {
      this.showCustomBackButton = true;
    }
  }

  doInfinite(infiniteScroll) {
    this.bucket += 50;
    this.resetPartnersArray = false;
    this.getPartners();
    infiniteScroll.complete();
  }

  customBackButtonClicked() {
    this.navCtrl.pop();
  }

  toString(input) {
    return input.toString();
  }

  scrollToTop(){
    console.debug(".........", this.content)
    this.content.scrollToTop();
  }

}





