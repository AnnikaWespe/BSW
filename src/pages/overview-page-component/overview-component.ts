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
import {WebviewComponent} from "../webview/webview";


@Component({
  providers: [],
  selector: 'page-overview',
  templateUrl: 'overview-component.html',
})
export class OverviewPageComponent implements OnDestroy, AfterViewChecked {

  title: string = "Übersicht";
  userLoggedIn = null;
  balance: number;
  bonusThisYear: number;
  bonusDataAvailable = false;
  heightBalanceBarBonusBarBuffer = ["0vh", "0vh", "0vh", "0vh"];
  maxHeightBarInVh = 14;
  location = {latitude: "0", longitude: "0"};
  errorMessage: string;
  waitingForResults = true;
  noDataToDisplay = false;
  onlinePartners: any[];
  offlinePartners: any[];
  favoritePartners = [];
  lastVisitedPartners = [];
  searchInterfaceOpen = false;
  moreThanFiveFavorites = false;
  moreThanFiveLastVisitedPartners = false;
  firstFiveFavorites;
  lastVisitedFive = [];

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
    if (navParams.data.login == true || localStorage.getItem('securityToken')) {
      let id = navParams.data.id || localStorage.getItem('mitgliedId');
      let token = navParams.data.token || localStorage.getItem('securityToken');
      this.userLoggedIn = true;
      this.getBonusData(id, token);
      this.getFavoritePartners(id, token);
    }
    this.checkIfGPSEnabled();
    this.getLastVisitedPartners();
    if (localStorage.getItem("showPromptForRatingAppDisabled") === null) {
      this.checkForPromptRateAppInStore()
    }
    if (localStorage.getItem("disallowUserTracking") === "false") {
      this.ga.trackView('Übersicht Screen')
    }
    setTimeout(() => {
      if (this.lastVisitedPartners.length == 0) {
        this.noDataToDisplay = true
      }
    }, 5000);
  }

  ngOnDestroy() {
    if (this.getPartnersSubscription) {
      this.getPartnersSubscription.unsubscribe();
    }
    if (this.getLocationSubscription) {
      this.getLocationSubscription.unsubscribe();
    }
  }

  getBonusData(id, token) {
    this.bonusService.getBonusData(id, token).subscribe((res) => {
      if (res.json().errors[0].beschreibung === "Erfolg") {
        let response = res.json().response;
        let date = new Date();
        let timeStamp = date.getTime().toString();
        console.log("success with bonus data");
        this.bonusDataAvailable = true;
        this.bonusThisYear = response.bonusGesamtJahr;
        this.balance = response.bonuskontostand;
        localStorage.setItem("bonusThisYear", response.bonusGesamtJahr);
        localStorage.setItem("balance", response.bonuskontostand);
        localStorage.setItem("bonusDataTimeStamp", timeStamp)
      }
      else {
        console.log("error with bonus data");
        let date = new Date();
        let now = date.getTime();
        let timeStamp = Number(localStorage.getItem("bonusDataTimeStamp"));
        let timeDiff = now - timeStamp;
        if (timeDiff < 86400000) {
          this.bonusDataAvailable = true;
          this.bonusThisYear = Number(localStorage.getItem("bonusThisYear"));
          this.balance = Number(localStorage.getItem("balance"));
        }
      }
    }, () => {
      console.log("error with bonus data");
      let date = new Date();
      let now = date.getTime();
      let timeStamp = Number(localStorage.getItem("bonusDataTimeStamp"));
      let timeDiff = now - timeStamp;
      if (timeDiff < 86400000) {
        this.bonusDataAvailable = true;
        this.bonusThisYear = Number(localStorage.getItem("bonusThisYear"));
        this.balance = Number(localStorage.getItem("balance"));
      }
    })
  }

  getFavoritePartners(id, token) {
    this.favoritesService.getFavorites(id, token).subscribe((res) => {
        this.getFavoritesByPfArray(res);
      },
      error => {
        console.log(error);
        this.displayFavoritesFromCache();
      });

  }

  getFavoritesByPfArray(res) {
    let errorMessage = res.json().errors[0].beschreibung;
    if (errorMessage === "Erfolg") {
      let favoritesByPf = res.json().response.favoriten.map((obj) => {
        return obj.pfNummer;
      });
      FavoritesData.favoritesByPfArray = favoritesByPf;
      this.partnerService.getPartners(this.location, 0, "", false, "RELEVANCE", "DESC", 10000, favoritesByPf).subscribe((res) => {
          let partnersArray = res.json().contentEntities;
          if (partnersArray) {
            for (let pfNumber of favoritesByPf) {
              for (let partner of partnersArray) {
                if (partner.number == pfNumber) {
                  this.favoritePartners.push(partner);
                  break;
                }
              }
            }
            this.favoritePartners = partnersArray;
            this.firstFiveFavorites = this.favoritePartners.slice(0, 5);
            if (this.favoritePartners.length > 5) {
              this.moreThanFiveFavorites = true;
            }
            this.waitingForResults = false;
          }

        },
        error => {
          console.log(error);
          this.displayFavoritesFromCache();
        })
    }
    else if (errorMessage === "Login fehlgeschlagen") {
      this.getUserToLogIn(errorMessage);
    }
  }

  displayFavoritesFromCache() {
    let cachedFavoritesArray = JSON.parse(localStorage.getItem("savedFavorites")) || [];
    if (cachedFavoritesArray.length) {
      this.favoritesFromCache = true;
      for (let pfNumber of cachedFavoritesArray) {
        let partner = JSON.parse(localStorage.getItem(pfNumber + "partner"));
        partner.logoUrl = localStorage.getItem(pfNumber + "logo");
        this.favoritePartners.push(partner);
      }
      this.firstFiveFavorites = this.favoritePartners.slice(0, 5);
      if (this.favoritePartners.length > 5) {
        this.moreThanFiveFavorites = true;
      }
    }
  }

  getLastVisitedPartners() {
    let lastVisitedPartnersArray = JSON.parse(localStorage.getItem("savedLastVisitedPartners")) || [];
    if (lastVisitedPartnersArray.length) {
      let maxIndex = lastVisitedPartnersArray.length - 1;
      for (let i = maxIndex; i > -1; i--) {
        let pfNumber = lastVisitedPartnersArray[i];
        let partner = JSON.parse(localStorage.getItem(pfNumber + "partner"));
        partner.logoString = localStorage.getItem(pfNumber + "logo")
        this.lastVisitedPartners.push(partner);
      }
      this.lastVisitedFive = this.lastVisitedPartners.slice(0, 5);
    }
    if (lastVisitedPartnersArray.length > 5) {
      this.moreThanFiveLastVisitedPartners = true;
    }
  }

  getUserToLogIn(errorMessage) {
    localStorage.removeItem("securityToken");
    this.navCtrl.setRoot(LoginPageComponent);
    console.log(errorMessage);
  }

  checkIfGPSEnabled() {
    if (localStorage.getItem("getLocationFromGPSEnabled") !== "false") {
      this.getLocationSubscription = this.locationService.getLocation().subscribe(
        (location) => {
          this.location = location;
          if (location.locationFound == true) {
            localStorage.setItem("getLocationFromGPSEnabled", "true");
            this.getPartners();
          }
          else {
            localStorage.setItem("getLocationFromGPSEnabled", "false");
          }
        }, (error) => {
          localStorage.setItem("getLocationFromGPSEnabled", "false");
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
      localStorage.setItem("latitude", "52.5219");
      localStorage.setItem("longitude", "13.4132");
      localStorage.setItem("locationAvailable", "false");
      localStorage.setItem("locationExact", "false");
      localStorage.setItem("locationName", "Berlin");
    }
    this.getPartners();
  }


  ngAfterViewChecked() {
    this.setFocus();
  }


  getPartners() {
    this.getPartnersSubscription = this.partnerService.getPartners(this.location, 0, "", false, "RELEVANCE", "DESC")
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

  loadUserSpecificPartnerTable(type) {
    if (type === "favorites") {
      this.navCtrl.push(UserSpecificPartnersComponent, {
        title: "Favoriten",
        fromCache: this.favoritesFromCache,
        partners: this.favoritePartners
      });
      console.log()
    }
    else {
      this.navCtrl.push(UserSpecificPartnersComponent, {
        title: "Zuletzt besucht",
        fromCache: true,
        partners: this.lastVisitedPartners
      })
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

  navigateToBonusOverview() {
    this.navCtrl.push(WebviewComponent, {urlType: 'VorteilsuebersichtWebviewUrl', title: 'Vorteilsübersicht'})
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

