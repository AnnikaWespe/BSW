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

  /* user information */
  id: string;
  token: string;
  userLoggedIn = null;
  location = {latitude: "0", longitude: "0"};

  heightBalanceBarBonusBarBuffer = ["0vh", "0vh", "0vh", "0vh"];
  maxHeightBarInVh = 14;
  errorMessage: string;

  waitingForResults = true;
  noDataToDisplay = false;
  dataFromCache = false;

  onlinePartners: any[];
  offlinePartners: any[];

  /* favorite partners */
  favoritePartners = [];
  favoritePartnersPeek = [];
  hasMoreFavoritePartners = false;
  favoritesFromCache = false;

  /* recent partners */
  recentPartners = [];
  recentPartnersPeek = [];
  hasMoreRecentPartners = false;
  recentPartnersFromCache = false;

  /* bonus view */
  bonusBalance: number;
  bonusThisYear: number;
  bonusHasData = false;
  bonusFromCache = false;

  searchInterfaceOpen = false;

  getPartnersSubscription: any;
  getLocationSubscription: any;

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

    this.subscribeForLocation();

    if (localStorage.getItem("showPromptForRatingAppDisabled") === null) {
      this.checkForPromptRateAppInStore()
    }

  }

  ionViewWillEnter() {

    this.cleanup();

    this.loadFavorites(this.id, this.token);
    this.loadRecentPartners();

    if (localStorage.getItem("disallowUserTracking") === "false") {
      this.ga.trackView('Übersicht Screen')
    }

    this.loadPartners();
    this.loadBonusData(this.id, this.token);

  }

  ngOnDestroy() {
    if (this.getPartnersSubscription) {
      this.getPartnersSubscription.unsubscribe();
    }
    if (this.getLocationSubscription) {
      this.getLocationSubscription.unsubscribe();
    }
  }

  loadBonusData(id, token) {

    this.bonusHasData = false;
    this.bonusFromCache = false;

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

  showBonusData(response) {

    if (response) {

      this.bonusHasData = true;
      this.bonusThisYear = response.bonusGesamtJahr;
      this.bonusBalance = response.bonuskontostand;
      localStorage.setItem("bonusThisYear", response.bonusGesamtJahr);
      localStorage.setItem("bonusBalance", response.bonuskontostand);
      localStorage.setItem("bonusDataTimeStamp", Date.now().toString());

      this.waitingForResults = false;
      this.checkForDataOnHomeScreen();

    } else {

      this.showBonusDataFromCache();

    }

  }

  showBonusDataFromCache() {

    if (localStorage.getItem("bonusThisYear")) {
      this.bonusHasData = true;
      this.bonusThisYear = Number(localStorage.getItem("bonusThisYear"));
      this.bonusBalance = Number(localStorage.getItem("bonusBalance"));
      this.bonusFromCache = true;
    }

    this.waitingForResults = false;
    this.checkForDataOnHomeScreen();

  }

  loadFavorites(id, token) {

    this.favoritesFromCache = false;

    if (id && token) {

      this.favoritesService.getFavorites(id, token).subscribe((res) => {
          this.loadFavoritesByPfArray(res);
        },
        error => {
          console.log(error);
          this.displayFavoritesFromCache();
        });

    }

  }

  loadFavoritesByPfArray(res) {

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
            this.favoritePartnersPeek = this.favoritePartners.slice(0, 5);
            if (this.favoritePartners.length > 5) {
              this.hasMoreFavoritePartners = true;
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
      this.navigateToLogin(errorMessage);
    }
  }

  displayFavoritesFromCache() {

    this.favoritePartners = [];
    this.favoritePartnersPeek = [];
    this.hasMoreFavoritePartners = false;
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

      this.favoritePartnersPeek = this.favoritePartners.slice(0, 5);
      if (this.favoritePartners.length > 5) {
        this.hasMoreFavoritePartners = true;
      }
    }

    if (this.favoritePartners.length > 0) {
      this.favoritesFromCache = true;
    }

    this.checkForDataOnHomeScreen();

  }

  loadRecentPartners() {

    this.recentPartnersFromCache = false;

    let lastVisitedPartnersArray = JSON.parse(localStorage.getItem("savedLastVisitedPartners")) || [];

    if (!lastVisitedPartnersArray || lastVisitedPartnersArray.length == 0) {
      this.recentPartners = [];
      this.recentPartnersPeek = [];
      this.hasMoreRecentPartners = false;
      this.waitingForResults = false;
      return;
    }

    this.partnerService.getPartners(this.location, 0, "", false, "RELEVANCE", "DESC", 10000, lastVisitedPartnersArray).subscribe((res) => {
        let partnersArray = res.json().contentEntities;
        if (partnersArray) {

          for (let pfNumber of lastVisitedPartnersArray) {
            for (let partner of partnersArray) {
              if (partner.number == pfNumber) {
                this.recentPartners.push(partner);
                break;
              }
            }
          }

          this.recentPartners = partnersArray;
          this.recentPartnersPeek = this.recentPartners.slice(0, 5);
          if (this.recentPartners.length > 5) {
            this.hasMoreRecentPartners = true;
          }

          this.waitingForResults = false;
        }

        this.checkForDataOnHomeScreen();

      },
      error => {
        console.log(error);
        this.showRecentPartnersFromCache();
      })

  }

  showRecentPartnersFromCache() {

    this.recentPartners = [];
    this.recentPartnersPeek = [];
    this.hasMoreRecentPartners = false;
    this.waitingForResults = false;

    let lastVisitedPartnersArray = JSON.parse(localStorage.getItem("savedLastVisitedPartners")) || [];
    if (lastVisitedPartnersArray.length && lastVisitedPartnersArray.length > 0) {

      let maxIndex = lastVisitedPartnersArray.length - 1;
      for (let i = maxIndex; i > -1; i--) {
        let pfNumber = lastVisitedPartnersArray[i];
        let partner = JSON.parse(localStorage.getItem(pfNumber + "partner"));

        if (partner) {
          partner.logoString = localStorage.getItem(pfNumber + "logo")
          this.recentPartners.push(partner);
        }

      }
      this.recentPartnersPeek = this.recentPartners.slice(0, 5);
      this.recentPartnersFromCache = true;
    }

    if (this.recentPartners.length > 0) {
      this.recentPartnersFromCache = true;
    }

    if (lastVisitedPartnersArray.length > 5) {
      this.hasMoreRecentPartners = true;
    }

    this.checkForDataOnHomeScreen();

  }

  navigateToLogin(errorMessage) {
    localStorage.removeItem("securityToken");
    this.navCtrl.setRoot(LoginPageComponent);
    console.log(errorMessage);
  }

  checkForDataOnHomeScreen() {

    /* show message if no data was loaded and we are not waiting for a result */
    let isDataAvailable = false;
    isDataAvailable = isDataAvailable || (this.recentPartners && this.recentPartners.length > 0);
    isDataAvailable = isDataAvailable || (this.favoritePartners && this.favoritePartners.length > 0);
    isDataAvailable = isDataAvailable || (this.onlinePartners && this.onlinePartners.length > 0);
    isDataAvailable = isDataAvailable || (this.offlinePartners && this.offlinePartners.length > 0);
    isDataAvailable = isDataAvailable || this.bonusHasData;

    this.noDataToDisplay = !this.waitingForResults && !isDataAvailable;

    /* show cache message if any data is loaded from cache */
    let isDataFromCache = false;
    isDataFromCache = isDataFromCache || this.favoritesFromCache;
    isDataFromCache = isDataFromCache || this.recentPartnersFromCache;
    isDataFromCache = isDataFromCache || this.bonusFromCache;

    this.dataFromCache = !this.waitingForResults && isDataAvailable && isDataFromCache;

  }

  subscribeForLocation() {

    this.getLocationSubscription = this.locationService.getLocation().subscribe(
      (location) => {
        this.location = location;
        if (location.locationFound == true) {
          localStorage.setItem("getLocationFromGPSEnabled", "true");
          this.loadPartners();
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


  loadPartners() {
    this.getPartnersSubscription = this.partnerService.getPartners(this.location, 0, "", false, "RELEVANCE", "DESC")
      .subscribe(
        body => {
          let returnedObject = body.json();
          this.extractOnlineAndOfflinePartners(returnedObject);
          this.waitingForResults = false;
        },
        error => this.errorMessage = <any>error);
  }

  extractOnlineAndOfflinePartners(returnedObject) {
    this.onlinePartners = returnedObject.originalSearchResults.bucketToSearchResult["ONLINEPARTNER"].contentEntities.slice(0, 5);
    let offlinePartnerArray = returnedObject.originalSearchResults.bucketToSearchResult["OFFLINEPARTNER"].contentEntities;
    if (offlinePartnerArray) {
      this.offlinePartners = offlinePartnerArray.slice(0, 5)
    }
    this.checkForDataOnHomeScreen();
  }

  navigateToOfflinePartners() {
    this.navCtrl.push(PartnerPageComponent, {type: "offlinePartnerPageComponent", navigatedFromOverview: true});
  }

  navigateToOnlinePartners() {
    this.navCtrl.push(PartnerPageComponent, {type: "onlinePartnerPageComponent", navigatedFromOverview: true});
  }

  navigateToPartnersWithSearchTerm(searchTerm) {

    this.searchInterfaceOpen = false;
    this.navCtrl.push(PartnerPageComponent, {
      type: "searchPageComponent",
      searchTerm: searchTerm,
      navigatedFromOverview: true
    })

  }

  navigateToPartnerDetail(partner = 0) {
    this.navCtrl.push(PartnerDetailComponent, {partner: partner})
  }

  navigateToCachedPartnerDetail(partner) {
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
        partners: this.recentPartners
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
    if (this.bonusBalance > this.bonusThisYear) {
      this.heightBalanceBarBonusBarBuffer[0] = this.maxHeightBarInVh + "vh";
      heightOtherDiv = Math.max(Math.round((this.bonusThisYear / this.bonusBalance) * this.maxHeightBarInVh), 1);
      this.heightBalanceBarBonusBarBuffer[1] = heightOtherDiv + "vh";
      this.heightBalanceBarBonusBarBuffer[3] = this.maxHeightBarInVh - heightOtherDiv + "vh";
    }
    else {
      this.heightBalanceBarBonusBarBuffer[1] = this.maxHeightBarInVh + "vh";
      heightOtherDiv = Math.max(Math.round((this.bonusBalance / this.bonusThisYear) * this.maxHeightBarInVh), 1);
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

  /* ensures that no old data is displayed on the homescreen */
  private cleanup() {
    console.log("cleanup()");

    let now = Date.now();
    let cacheTime = 1000 * 60 * 60 * 24;

    /* bonusdata - delete if older than 24 hours */
    let bonusTime = Number(localStorage.getItem("bonusDataTimeStamp"));
    if (bonusTime && bonusTime < (now - cacheTime)) {

      localStorage.removeItem("bonusThisYear");
      localStorage.removeItem("bonusBalance");
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

