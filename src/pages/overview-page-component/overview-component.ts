import {Component, OnDestroy, AfterViewChecked} from '@angular/core';
import {AlertController, NavController, NavParams} from 'ionic-angular';


import {PartnerService} from "../../services/partner-service";
import {PartnerPageComponent} from "../partner-page-component/partner-page-component";
import {LocationService} from "../../services/location-service";
import {PartnerDetailComponent} from "../partner-page-component/partner-detail-component/partner-detail-component";
import {FavoritesService} from "../../services/favorites-service";
import {FavoritesData} from "../../services/favorites-data";
import {UserSpecificPartnersComponent} from "./user-specific-partners-page-component/user-specific-partners-component";
import {LoginPageComponent} from "../login-page-component/login-component";
import {GoogleAnalytics} from "@ionic-native/google-analytics";
import {BonusService} from "./bonus-service";


@Component({
  providers: [],
  selector: 'page-overview',
  templateUrl: 'overview-component.html',
})
export class OverviewPageComponent implements OnDestroy, AfterViewChecked {

  title: string = "Übersicht";
  userLoggedIn = localStorage.getItem('securityToken');
  balance: number;
  bonusThisYear: number;
  bonusDataAvailable = false;
  heightBalanceBarBonusBarBuffer = ["0vh", "0vh", "0vh", "0vh"];
  maxHeightBarInVh = 14;
  location = {latitude: "0", longitude: "0"};
  errorMessage: string;
  waitingForResults = true;
  onlinePartners: any[];
  offlinePartners: any[];
  favoritePartners = [];
  lastVisitedPartners = [];
  searchInterfaceOpen = false;

  getPartnersSubscription: any;
  getLocationSubscription: any;
  favoritesFromCache = false;


  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private partnerService: PartnerService,
              private locationService: LocationService,
              private favoritesService: FavoritesService,
              private alertCtrl: AlertController,
              private ga: GoogleAnalytics,
              private bonusService: BonusService) {
    this.checkIfGPSEnabled();
    this.getFavoriteAndLastVisitedPartners();
    this.getBonusData();
    this.getLastVisitedPartners();
    if (localStorage.getItem("showPromptForRatingAppDisabled") === null) {
      this.checkForPromptRateAppInStore()
    }
    if (localStorage.getItem("disallowUserTracking") === "false") {
      this.ga.trackView('Übersicht Screen')
    }
  }

  ngOnDestroy() {
    if (this.getPartnersSubscription) {
      this.getPartnersSubscription.unsubscribe();
    }
    if (this.getLocationSubscription) {
      this.getLocationSubscription.unsubscribe();
    }
  }

  getBonusData() {
    this.bonusService.getBonusData().subscribe((res) => {
      if (res.json().errors[0].beschreibung === "Erfolg") {
        let response = res.json().response;
        this.bonusDataAvailable = true;
        this.bonusThisYear = response.bonusGesamtJahr;
        this.balance = response.bonuskontostand;
      }
      else console.log("no bonus data found");
    })
  }

  getFavoriteAndLastVisitedPartners() {
    if (this.userLoggedIn) {
      this.favoritesService.getFavorites().subscribe((res) => {
          this.getFavoritesByPfArray(res);
        },
        error => {
          this.displayFavoritesFromCache();
        });
    }
  }

  getFavoritesByPfArray(res) {
    let errorMessage = res.json().errors[0].beschreibung;
    if (errorMessage === "Erfolg") {
      let favoritesByPf = res.json().response.favoriten.map((obj) => {
        return obj.pfNummer;
      });
      FavoritesData.favoritesByPfArray = favoritesByPf;
      this.partnerService.getPartners(this.location, 0, "", false, 10000, favoritesByPf).subscribe((res) => {
          this.favoritePartners = res.json().contentEntities.slice(0, 5);
          this.waitingForResults = false;
        },
        error => {
          this.displayFavoritesFromCache();
        })
    }
    else if (errorMessage === "Login fehlgeschlagen") {
      this.getUserToLogIn(errorMessage);
    }
  }

  displayFavoritesFromCache() {
    let cachedFavoritesArray = JSON.parse(localStorage.getItem("savedFavorites")) || [];
    this.favoritesFromCache = true;
    for (let pfNumber of cachedFavoritesArray) {
      let partner = JSON.parse(localStorage.getItem(pfNumber + "partner"));
      partner.logoUrl = localStorage.getItem(pfNumber + "logo");
      this.favoritePartners.push(partner);
    }
  }

  getLastVisitedPartners() {
    let lastVisitedPartnersArray = JSON.parse(localStorage.getItem("savedLastVisitedPartners")) || [];
    console.log(localStorage.getItem("savedLastVisitedPartners"));
    for (let pfNumber of lastVisitedPartnersArray) {
      console.log(localStorage.getItem(pfNumber + "logo"));
      let partner = JSON.parse(localStorage.getItem(pfNumber + "partner"));
      partner.logoString = localStorage.getItem(pfNumber + "logo");
      this.lastVisitedPartners.push(partner);
    }
  }

  getUserToLogIn(errorMessage) {
    localStorage.removeItem("securityToken");
    this.navCtrl.setRoot(LoginPageComponent);
    console.log(errorMessage);
  }

  checkIfGPSEnabled() {
    if (localStorage.getItem("getLocationFromGPSEnabled") === "true") {
      this.getLocationSubscription = this.locationService.getLocation().subscribe(
        (object) => {
          if (object.locationFound == true) {
            this.location.latitude = object.lat;
            this.location.longitude = object.lon;
            this.getPartners();
          }
          else {
            this.getStoredLocationData();
          }
        }
      )
    }
    else {
      this.getStoredLocationData()
    }
  }

  getStoredLocationData() {
    if (localStorage.getItem("locationAvailable") === "true") {
      this.location.latitude = localStorage.getItem("latitude");
      this.location.longitude = localStorage.getItem("longitude");
    }
    else {
      this.location.latitude = "52.5219";
      this.location.longitude = "13.4132";
    }
    this.getPartners();
  }


  public
  ngAfterViewChecked() {
    this.setFocus();
  }


  getPartners() {
    this.getPartnersSubscription = this.partnerService.getPartners(this.location, 0, "", false)
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
    if (offlinePartnerArray) {
      this.offlinePartners = offlinePartnerArray.slice(0, 5)
    }
  }

  showOfflinePartners() {
    this.navCtrl.push(PartnerPageComponent, {type: "offlinePartnerPageComponent", navigatedFromOverview: true});
  }


  showOnlinePartners() {
    this.navCtrl.push(PartnerPageComponent, {type: "onlinePartnerPageComponent", navigatedFromOverview: true});
  }

  loadPartnerPage(searchTerm) {
    this.searchInterfaceOpen = false;
    this.navCtrl.push(PartnerPageComponent, {
      type: "searchPageComponent",
      searchTerm: searchTerm,
      navigatedFromOverview: true
    })
  }

  showPartner(partner = 0) {
    this.navCtrl.push(PartnerDetailComponent, {partner: partner})
  }

  showCachedPartner(partner) {
    let partnerDetails = JSON.parse(localStorage.getItem(partner.number + "partnerDetails"));
    this.navCtrl.push(PartnerDetailComponent, {partner: partner, partnerDetails: partnerDetails})
  }


  getPartnerFromPfNumber(number) {
    return this.partnerService.getPartners(this.location, 0, number, false)
  }

  loadUserSpecificPartnerTable(type) {
    if (type === "favorites") {
      this.navCtrl.push(UserSpecificPartnersComponent, {title: "Favoriten"})
    }
    else {
      this.navCtrl.push(UserSpecificPartnersComponent, {title: "Zuletzt besucht"})
    }
  }

  checkForPromptRateAppInStore() {
    let numberOfVisitsUpUntilNow = localStorage.getItem("numberOfVisits");
    if (numberOfVisitsUpUntilNow) {
      let numberOfVisits = parseInt(numberOfVisitsUpUntilNow) + 1;
      localStorage.setItem("numberOfVisits", numberOfVisits.toString())
      if (numberOfVisits >= 10 && numberOfVisits % 5 === 0) {
        this.presentPromptRateApp();
      }
    }
    else {
      localStorage.setItem("numberOfVisits", "1");
    }
  }

  presentPromptRateApp() {
    let alert = this.alertCtrl.create({
      title: 'App bewerten',
      message: 'Gefällt Ihnen die BSW-App? Dann geben Sie eine Bewertung ab und lassen uns Ihre Meinung wissen.',
      buttons: [
        {
          text: 'Ja',
          role: 'cancel',
          handler: () => {
            //TODO real link to app store
            window.open('http://example.com/login/{{user._id}}', '_system', 'location=yes');
            localStorage.setItem("showPromptForRatingAppDisabled", "true");
          }
        },
        {
          text: 'Nein',
          role: 'cancel'
        },
        {
          text: 'Nein, nicht mehr anzeigen',
          role: 'cancel',
          handler: () => {
            localStorage.setItem("showPromptForRatingAppDisabled", "true");
          }
        }
      ]
    });
    alert.present();
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

  private
  setFocus() {
    let searchInputField = document.getElementById('mySearchInputField');
    if (searchInputField) {
      searchInputField.focus();
    }
  }

}
