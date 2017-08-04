import {Component, AfterViewChecked, ViewChild, OnDestroy, EventEmitter, Output} from '@angular/core';
import {NavController, NavParams, Content, ModalController} from 'ionic-angular';

import {PartnerService} from "../../services/partner-service";
import {ChooseLocationManuallyComponent} from "./choose-location-manually/choose-location-manually-component";
import {AlertController} from 'ionic-angular';
import {PartnerDetailComponent} from "./partner-detail-component/partner-detail-component";
import {LocationService} from "../../services/location-service";
import {style, state, trigger, transition, animate} from "@angular/animations";
import {GoogleAnalytics} from "@ionic-native/google-analytics";

@Component({
  selector: 'partner-page-component',
  templateUrl: 'partner-page-component.html',
  animations: [trigger('show', [state('false', style({
    height: '0vh'
  })),
    state('true', style({
      height: '84vh'
    })),
    transition('false <=> true', animate('200ms'))
  ])]
})
export class PartnerPageComponent implements AfterViewChecked, OnDestroy {
  @ViewChild(Content) content: Content;
  @Output() justPartnersWithCampaign$ = new EventEmitter();
  @Output() searchTerm$ = new EventEmitter();
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
  noPartnersToDisplay = false;
  noPartnersToDisplayBecauseOfParameters = false;
  showTryAgainToGetPartnersButton = false;
  waitingForGPSSignal = false;


  showMap = false;
  showMapIcon = false;

  displayedPartners = [];

  offlinePartners = [];
  onlinePartners = [];
  allPartners = [];
  partnersWithCampaign = [];
  moreDataCanBeLoaded = true;
  bucket: number = 0;
  onReload = false;
  searchTerm = "";

  showOfflinePartners = false;
  showOnlinePartners = false;
  showOnlyPartnersWithCampaign = false;
  pageType: string;
  navigatedFromOverview = false;
  onlinePartnerPageComponent = false;
  offlinePartnerPageComponent = false;
  searchPageComponent = false;

  getLocationFromGPSEnabled = false;
  cityName = "manuell gewählter Ort";

  searchInterfaceOpen = false;

  sortByCriterion = "RELEVANCE";
  sortOrder = "DESC";
  sortByArray = [true, false, false, false, false, false, false]

  public ngAfterViewChecked() {
    this.setFocus();
  }

  ngOnDestroy() {
    this.globallyUnsubscribe();
  }

  globallyUnsubscribe() {
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
              public locationService: LocationService,
              private ga: GoogleAnalytics,
              private modalCtrl: ModalController) {

    let pageType = navParams.get("type");
    if (navParams.get('navigatedFromOverview')) {
      this.navigatedFromOverview = true;
    }
    this[pageType] = true;
    this.pageType = pageType;
    this.searchTerm = navParams.get("searchTerm") || "";
    this.getLocationFromGPSEnabled = (localStorage.getItem("getLocationFromGPSEnabled") === "true");
    this.cityName = localStorage.getItem("cityName");
    this.setParameters();
    if (localStorage.getItem("disallowUserTracking") === "false") {
      this.gaTrackPageView();
    }
  }

  setParameters() {
    this.showOnlyPartnersWithCampaign = this.navParams.get("showOnlyPartnersWithCampaign") || false;
    if (this.offlinePartnerPageComponent) {
      this.showOfflinePartners = true;
      this.displayedPartners = this.offlinePartners;
      this.title = "Vor-Ort-Partner";
      this.checkIfGPSEnabled();
      this.sortByArray = [false, false, false, false, false, false, true]
      this.sortByCriterion = "DISTANCE";
      this.sortOrder = "ASC";
    }
    if (this.onlinePartnerPageComponent) {
      this.showOnlinePartners = true;
      this.displayedPartners = this.onlinePartners;
      this.title = "Online-Partner";
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
            this.getStoredLocationData();
            this.getPartners();
          }
        },
        (err) => {
          localStorage.setItem("getLocationFromGPSEnabled", "false");
          this.getLocationFromGPSEnabled = false;
          this.getStoredLocationData();
          this.getPartners();
        }
      )
    }
    else {
      this.getStoredLocationData();
      this.getPartners();
    }
  }

  getStoredLocationData() {
    this.location.latitude = localStorage.getItem("latitude");
    this.location.longitude = localStorage.getItem("longitude");
    this.cityName = localStorage.getItem("locationName");
    if (this.cityName === "undefined" || this.cityName == null) {
      this.cityName = "zuletzt verfügbarer Ort"
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
    this.searchTerm = searchTerm + " ";
    this.title = searchTerm;
    if (this.navigatedFromOverview) {
      this.showCustomBackButton = true;
    }
    if (this.showMap) {
      this.searchTerm$.emit(searchTerm);
    }
    this.resetPartnersArrays();
    this.getPartners();
  }

  sortBy(indexInSortByArray, criterion, order) {
    this.sortByArray = [false, false, false, false, false, false, false];
    this.sortByArray[indexInSortByArray] = true;
    this.sortByCriterion = criterion;
    this.sortOrder = order;
    this.resetPartnersArrays();
    this.waitingForResults = true;
    this.showDropdown = [false, false, false];
    this.showDropdownForAnimation = ["false", "false"];
    this.content.scrollToTop(0);
    this.getPartners();
  }


  getPartners() {
    console.log(this.location, this.bucket, this.searchTerm, this.showOnlyPartnersWithCampaign);
    this.getPartnersSubscription = this.partnerService.getPartners(this.location, this.bucket, this.searchTerm, this.showOnlyPartnersWithCampaign, this.sortByCriterion, this.sortOrder, 100)
      .subscribe(
        body => {
          let returnedObject = body.json();
          let partners = returnedObject.contentEntities;
          console.log(returnedObject);
          if (!partners) {
            this.moreDataCanBeLoaded = false;
            console.log("no data found");
            this.getPartnersSubscription.unsubscribe();
            this.waitingForResults = false;
            // && this.displayedPartners.length == 0
            if (this.searchTerm && !this.onReload) {
              this.showPromptNoResultForSearch();
              this.searchTerm = "";
              this.title = localStorage.getItem("title");
              this.resetPartnersArrays();
              this.getPartners();
            }
            else {
              if (this.displayedPartners.length == 0) {
                this.noPartnersToDisplay = true;
              }
            }
            return;
          }
          this.showTryAgainToGetPartnersButton = false;
          this.getDifferentCategories(returnedObject);
        },
        error => {
          this.showTryAgainToGetPartnersButton = true;
          this.waitingForResults = false;
        });
  }


  resetPartnersArrays() {
    this.allPartners = [];
    this.onlinePartners = [];
    this.offlinePartners = [];
    this.partnersWithCampaign = [];
    this.bucket = 0;
    this.onReload = false;
    this.waitingForResults = true;
    this.displayedPartners = [];
    this.showTryAgainToGetPartnersButton = false;
    this.noPartnersToDisplay = false;
    this.noPartnersToDisplayBecauseOfParameters = false;
    this.moreDataCanBeLoaded = true;
  }

  getDifferentCategories(returnedObject) {
    this.allPartners = this.checkForValidResult(this.allPartners, returnedObject.contentEntities);
    this.offlinePartners = this.checkForValidResult(this.offlinePartners, returnedObject.originalSearchResults.bucketToSearchResult["OFFLINEPARTNER"].contentEntities);
    this.onlinePartners = this.checkForValidResult(this.onlinePartners, returnedObject.originalSearchResults.bucketToSearchResult["ONLINEPARTNER"].contentEntities);
    this.getDisplay();
    this.waitingForResults = false;
  }

  checkForValidResult(partnersArray, resultArray) {
    if (resultArray) {
      partnersArray = partnersArray.concat(resultArray);
    }
    else {
      this.moreDataCanBeLoaded = false;
    }
    return partnersArray;
  }


  filterButtonPushed() {
    this.content.scrollToTop(0).then(() => {
      this.resetPartnersArrays();
      this.waitingForResults = true;
      this.showDropdown = [false, false, false];
      this.showDropdownForAnimation = ["false", "false"];
      this.justPartnersWithCampaign$.emit(this.showOnlyPartnersWithCampaign);
      if (this.showOfflinePartners) {
        this.checkIfGPSEnabled();
      }
      else {
        this.getPartners();
      }
    }, () => {
    })
  }

  getDisplay() {
    if (!this.showOfflinePartners && !this.showOnlinePartners) {
      this.askForValidCategories();
      return;
    }
    if (this.showOfflinePartners && !this.showOnlinePartners) {
      this.title = this.searchTerm || "Vor-Ort-Partner";
      localStorage.setItem("title", "Vor Ort Partner");
      this.displayedPartners = this.offlinePartners;
    }
    else if (!this.showOfflinePartners && this.showOnlinePartners) {
      this.title = this.searchTerm || "Online-Partner";
      localStorage.setItem("title", "Online Partner");
      this.displayedPartners = this.onlinePartners;
    }
    else if (this.showOfflinePartners && this.showOnlinePartners) {
      this.title = this.searchTerm || "Alle Partner";
      localStorage.setItem("title", "Alle Partner");
      this.displayedPartners = this.allPartners;
    }
    console.log(this.displayedPartners);
    if (this.displayedPartners.length === 0){
      this.noPartnersToDisplayBecauseOfParameters = true;
    }
  }


  chooseLocationManually() {
    event.stopPropagation();
    let chooseLocationManuallyModal = this.modalCtrl.create(ChooseLocationManuallyComponent);
    chooseLocationManuallyModal.present();
    chooseLocationManuallyModal.onDidDismiss((data) => {
      if (data) {
        this.location.latitude = data.latitude;
        this.location.longitude = data.longitude;
        this.cityName = data.name;
        this.getLocationFromGPSEnabled = false;
        localStorage.setItem("getLocationFromGPSEnabled", "false");
        this.resetPartnersArrays();
        this.getPartners();
      }
    })
    this.showDropdown = [false, false, false];
    this.showDropdownForAnimation = ["false", "false"];
  }


  showPartner(partner = 0) {
    this.navCtrl.push(PartnerDetailComponent, {partner: partner});
    this.showCustomBackButton = false;
  }

  askForValidCategories() {
    let prompt = this.alertCtrl.create({
      title: 'Bitte wählen Sie entweder "Vor-Ort-Partner" oder "Online Partner" aus.',
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

  showPromptNoResultForSearch() {
    let prompt = this.alertCtrl.create({
      title: 'Zu Ihrer Suche konnten wir leider keine Partner finden.',
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

  toggleMapAndList() {
    this.showMap = !this.showMap;
    this.showDropdown = [false, false, false];
    this.showDropdownForAnimation = ["false", "false"];
    this.globallyUnsubscribe();
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
            localStorage.setItem("locationExact", "true");
            this.getLocationNameSubscription = this.locationService.getLocationName(this.location.latitude, this.location.longitude).subscribe((cityName) => {
              this.cityName = cityName;
              //localStorage.setItem()
            })
          }
          else {
            this.showPromptGPSDisabled();
            this.waitingForGPSSignal = false;
          }
        }, ((err) => {
          this.showPromptGPSDisabled();
          this.waitingForGPSSignal = false;
        })
      )
    }
    else {
      localStorage.setItem("getLocationFromGPSEnabled", "false");
      localStorage.setItem("locationExact", "false");
      this.getLocationFromGPSEnabled = false;
      this.getStoredLocationData();
    }
  }


  gaTrackPageView() {
    let trackingName;
    if (this.pageType === "onlinePartnerPageComponent") {
      trackingName = "Online Partner"
    }
    else if (this.pageType === "offlinePartnerPageComponent") {
      trackingName = "Vor Ort Partner"
    }
    else if (this.pageType === "searchPageComponent") {
      trackingName = "Alle Partner"
    }
    this.ga.trackView(trackingName + " Screen")
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
    this.showDropdown[2] = this.showDropdown[0] || this.showDropdown[1];
    this.showDropdownForAnimation = [this.showDropdown[0].toString(), this.showDropdown[1].toString()];
  }

  closeSearchInterface() {
    this.searchInterfaceOpen = false;
    if (this.showMap) {
      this.searchTerm$.emit("");
    }
    if (this.searchTerm) {
      this.searchTerm = "";
      this.resetPartnersArrays();
      this.getPartners();
    }
    this.searchTerm = "";
    this.showDropdown = [false, false, false];
    this.showDropdownForAnimation = ["false", "false"];
    this.title = localStorage.getItem("title");
    if (this.navigatedFromOverview) {
      this.showCustomBackButton = true;
    }
  }

  doInfinite(infiniteScroll) {
    this.bucket += 50;
    this.onReload = true;
    this.getPartners();
    infiniteScroll.complete();
  }

  customBackButtonClicked() {
    this.navCtrl.pop();
  }

  toString(input) {
    return input.toString();
  }

  scrollToTop() {
    this.content.scrollToTop();
  }

}





