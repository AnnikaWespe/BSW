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
  id: string;
  token: string;
  userLoggedIn = null;
  balance: number;
  bonusThisYear: number;
  bonusDataAvailable = false;
  bonusDataFromCache = false;
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
  lastVisitedFromCache = false;

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
      this.id = navParams.data.id || localStorage.getItem('mitgliedId');
      this.token = navParams.data.token || localStorage.getItem('securityToken');
      this.userLoggedIn = true;
    }
    this.checkIfGPSEnabled();

    if (localStorage.getItem("showPromptForRatingAppDisabled") === null) {
      this.checkForPromptRateAppInStore()
    }

  }

  ionViewWillEnter() {

    this.cleanup();

    this.getFavoritePartners(this.id, this.token);
    this.getLastVisitedPartners();

    if (localStorage.getItem("disallowUserTracking") === "false") {
      this.ga.trackView('Übersicht Screen')
    }

    this.getPartners();
    this.getBonusData(this.id, this.token);
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

    this.bonusDataAvailable = false;

    if (!id || !token) {
      return;
    }

    this.bonusService.getBonusData(id, token).subscribe((res) => {
      if (res.json().errors[0].beschreibung === "Erfolg") {

        console.log("success with bonus data");
        this.showBonusData(res.json().response);

      } else {

        console.error("error with bonus data");
        this.showBonusDataFromCache();

      }
    }, () => {

      console.error("error with bonus data");
      this.showBonusDataFromCache();

    })

  }

  showBonusData(response){

    if(response) {

      this.bonusDataAvailable = true;
      this.bonusThisYear = response.bonusGesamtJahr;
      this.balance = response.bonuskontostand;
      this.bonusDataFromCache = false;
      localStorage.setItem("bonusThisYear", response.bonusGesamtJahr);
      localStorage.setItem("balance", response.bonuskontostand);
      localStorage.setItem("bonusDataTimeStamp", Date.now().toString());

      this.waitingForResults = false;
      this.checkForDataOnHomeScreen();

    } else {

      this.showBonusDataFromCache();

    }

  }

  showBonusDataFromCache() {

    if(localStorage.getItem("bonusThisYear")) {
      this.bonusDataAvailable = true;
      this.bonusDataFromCache = true;
      this.bonusThisYear = Number(localStorage.getItem("bonusThisYear"));
      this.balance = Number(localStorage.getItem("balance"));
    }

    this.waitingForResults = false;
    this.checkForDataOnHomeScreen();

  }

  getFavoritePartners(id, token) {

    if (id && token) {
      this.favoritesService.getFavorites(id, token).subscribe((res) => {
          this.getFavoritesByPfArray(res);
        },
        error => {
          console.log(error);
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

          this.checkForDataOnHomeScreen();

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

    this.favoritePartners = [];
    this.firstFiveFavorites = [];
    this.moreThanFiveFavorites = false;
    this.waitingForResults = false;

    let cachedFavoritesArray = JSON.parse(localStorage.getItem("savedFavorites")) || [];
    if (cachedFavoritesArray.length) {
      this.favoritesFromCache = true;
      for (let pfNumber of cachedFavoritesArray) {

        let partner = JSON.parse(localStorage.getItem(pfNumber + "partner"));
        if (partner) {
          partner.logoUrl = localStorage.getItem(pfNumber + "logo");
          this.favoritePartners.push(partner);
        }

      }

      this.firstFiveFavorites = this.favoritePartners.slice(0, 5);
      if (this.favoritePartners.length > 5) {
        this.moreThanFiveFavorites = true;
      }
    }

    this.checkForDataOnHomeScreen();

  }

  getLastVisitedPartners() {

    let lastVisitedPartnersArray = JSON.parse(localStorage.getItem("savedLastVisitedPartners")) || [];

    if (!lastVisitedPartnersArray || lastVisitedPartnersArray.length == 0) {
      this.lastVisitedPartners = [];
      this.lastVisitedFive = [];
      this.moreThanFiveLastVisitedPartners = false;
      this.waitingForResults = false;
      return;
    }

    this.partnerService.getPartners(this.location, 0, "", false, "RELEVANCE", "DESC", 10000, lastVisitedPartnersArray).subscribe((res) => {
        let partnersArray = res.json().contentEntities;
        if (partnersArray) {

          for (let pfNumber of lastVisitedPartnersArray) {
            for (let partner of partnersArray) {
              if (partner.number == pfNumber) {
                this.lastVisitedPartners.push(partner);
                break;
              }
            }
          }

          this.lastVisitedPartners = partnersArray;
          this.lastVisitedFive = this.lastVisitedPartners.slice(0, 5);
          if (this.lastVisitedPartners.length > 5) {
            this.moreThanFiveLastVisitedPartners = true;
          }

          this.waitingForResults = false;
          this.lastVisitedFromCache = false;
        }

        this.checkForDataOnHomeScreen();

      },
      error => {
        console.log(error);
        this.displayLastVisitedPartnersFromCache();
      })

  }

  displayLastVisitedPartnersFromCache() {

    this.lastVisitedPartners = [];
    this.lastVisitedFive = [];
    this.moreThanFiveLastVisitedPartners = false;
    this.waitingForResults = false;

    let lastVisitedPartnersArray = JSON.parse(localStorage.getItem("savedLastVisitedPartners")) || [];
    if (lastVisitedPartnersArray.length && lastVisitedPartnersArray.length > 0) {

      let maxIndex = lastVisitedPartnersArray.length - 1;
      for (let i = maxIndex; i > -1; i--) {
        let pfNumber = lastVisitedPartnersArray[i];
        let partner = JSON.parse(localStorage.getItem(pfNumber + "partner"));

        if (partner) {
          partner.logoString = localStorage.getItem(pfNumber + "logo")
          this.lastVisitedPartners.push(partner);
        }

      }
      this.lastVisitedFive = this.lastVisitedPartners.slice(0, 5);
      this.lastVisitedFromCache = true;
    }

    if (lastVisitedPartnersArray.length > 5) {
      this.moreThanFiveLastVisitedPartners = true;
    }

    this.checkForDataOnHomeScreen();

  }

  getUserToLogIn(errorMessage) {
    localStorage.removeItem("securityToken");
    this.navCtrl.setRoot(LoginPageComponent);
    console.log(errorMessage);
  }

  /* show message if no data was loaded and we are not waiting for a result */
  checkForDataOnHomeScreen() {

    let isDataAvailable = false;

    isDataAvailable = isDataAvailable || (this.lastVisitedPartners && this.lastVisitedPartners.length > 0);
    isDataAvailable = isDataAvailable || (this.favoritePartners && this.favoritePartners.length > 0);
    isDataAvailable = isDataAvailable || (this.onlinePartners && this.onlinePartners.length > 0);
    isDataAvailable = isDataAvailable || (this.offlinePartners && this.offlinePartners.length > 0);
    isDataAvailable = isDataAvailable || this.bonusDataAvailable;

    this.noDataToDisplay = !this.waitingForResults && !isDataAvailable;

  }

  checkIfGPSEnabled() {

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
    this.checkForDataOnHomeScreen();
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

  private cleanup() {
    console.log("cleanup()");

    let now = Date.now();
    let cacheTime = 1000 * 60; //1000 * 60 * 60 * 24;

    /* bonusdata - delete if older than 24 hours */
    let bonusTime = Number(localStorage.getItem("bonusDataTimeStamp"));
    if (bonusTime && bonusTime < (now - cacheTime)) {

      localStorage.removeItem("bonusThisYear");
      localStorage.removeItem("balance");
      localStorage.removeItem("bonusDataTimeStamp");
      console.log("Clearing cached bonus data");

    }

    /* partners - delete if older than 24 hours */
    let lastVisited = JSON.parse(localStorage.getItem("savedLastVisitedPartners")) || [];
    let lastVisitedComplete = JSON.parse(localStorage.getItem("savedLastVisitedPartnersComplete")) || [];
    let favorites = JSON.parse(localStorage.getItem("savedFavorites")) || [];

    let partnersToDelete = [];
    let allPartners = lastVisited.concat(lastVisitedComplete, favorites);

    for (let p in allPartners) {

      let loadedPartner = JSON.parse(localStorage.getItem(allPartners[p] + "partnerDetails"));

      if (loadedPartner && (!loadedPartner.fetchTime || loadedPartner.fetchTime < (now - cacheTime))) {
        partnersToDelete.push(allPartners[p]);
      }

    }

    for (let p in partnersToDelete) {

      console.log("Deleting cache of: " + partnersToDelete[p]);

      localStorage.removeItem(partnersToDelete[p] + "partnerDetails");
      localStorage.removeItem(partnersToDelete[p] + "partner");
      localStorage.removeItem(partnersToDelete[p] + "logo");

    }

  }

}

