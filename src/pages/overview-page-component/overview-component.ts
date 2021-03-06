import {Component, OnDestroy, AfterViewChecked} from '@angular/core';
import {AlertController, NavController, Platform, NavParams} from 'ionic-angular';


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
import {SavePartnersService} from "../partner-page-component/partner-detail-component/save-partners-service";
import {AuthService} from "../../services/auth-service";
import {ExternalSiteService} from "../../services/external-site-service";
import {InitService} from "../../app/init-service";

@Component({
  providers: [],
  selector: 'page-overview',
  templateUrl: 'overview-component.html',
})
export class OverviewPageComponent implements OnDestroy, AfterViewChecked {

  title: string = "Übersicht";

  /* user information */
  location: any = {latitude: "0", longitude: "0"};

  heightBalanceBarBonusBarBuffer = [0, 0, 0, 0];
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
  platformSubscription: any;
  locationSubscription: any;

  activeRequests = 0;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private partnerService: PartnerService,
              private locationService: LocationService,
              private favoritesService: FavoritesService,
              private alertCtrl: AlertController,
              private ga: GoogleAnalytics,
              private bonusService: BonusService,
              public authService: AuthService,
              private platform: Platform,
              private savePartnersService: SavePartnersService,
              private externalSiteService: ExternalSiteService,
              private initService: InitService) {

    if (localStorage.getItem("showPromptForRatingAppDisabled") === null) {
      this.checkForPromptRateAppInStore()
    }

    this.platformSubscription = this.platform.resume.subscribe(() => this.getLocation());

    this.locationSubscription = this.locationService.getLocation().subscribe(() => {

      let loc = this.locationService.getCurrentLocation();
      if (!this.location || loc.fromGPS != this.location.fromGPS || !loc.fromGPS) {
        this.location = loc;
        this.loadAllData();
      }

    });

    this.initService.setWebViewUrls()
      .then(() => {
        console.log("webview urls loaded");
      }, (error) => {
        console.error("cannot load webview urls");
      });

    this.waitingForResults = true;
    
  }

  ionViewWillEnter() {

    if (localStorage.getItem("disallowUserTracking") === "false") {
      this.ga.trackView('Übersicht Screen')
    }

    this.locationService.startLocationService();
    this.loadAllData();

  }

  loadAllData() {

    this.savePartnersService.cleanup();
    this.getLocation();

    this.loadRecentPartners();
    this.loadPartners();

    if(this.authService.getUser().loggedIn) {
      this.loadFavorites(this.authService.getUser().mitgliedId, this.authService.getUser().securityToken);
      this.loadBonusData(this.authService.getUser().mitgliedId, this.authService.getUser().securityToken);
    }

  }

  ngOnDestroy() {
    if (this.getPartnersSubscription) {
      this.getPartnersSubscription.unsubscribe();
    }
    if (this.platformSubscription) {
      this.platformSubscription.unsubscribe();
    }

    if (this.locationSubscription) {
      this.locationSubscription.unsubscribe();
    }
  }

  getLocation() {
    this.location = this.locationService.getCurrentLocation();
    this.loadPartners();
  }

  loadBonusData(id, token) {

    this.bonusHasData = false;
    this.bonusFromCache = false;

    if (!id || !token) {
      return;
    }

    this.activeRequests += 1;
    this.bonusService.getBonusData(id, token).subscribe((res) => {

      this.activeRequests -= 1;
      this.waitingForResults = false;
      if (res.json().errors[0].beschreibung === "Erfolg") {

        console.log("success with bonus data");
        this.showBonusData(res.json().response);

      } else {

        console.error("error with bonus data");
        this.showBonusDataFromCache();

      }
    }, () => {

      console.error("error with bonus data");
      this.activeRequests -= 1;
      this.waitingForResults = false;
      this.showBonusDataFromCache();

    })

  }

  showBonusData(response) {

    if (response) {

      this.bonusHasData = true;
      this.bonusThisYear = response.bonuskontostand;
      this.bonusBalance = response.bonusGesamtJahr;

      SavePartnersService.storeBonus(this.bonusThisYear, this.bonusBalance);

      this.checkForDataOnHomeScreen();

    } else {

      this.showBonusDataFromCache();

    }

  }

  showBonusDataFromCache() {

    let bonus = SavePartnersService.loadBonus();

    if (bonus) {
      this.bonusHasData = true;
      this.bonusThisYear = bonus.benefit;
      this.bonusBalance = bonus.balance;
      this.bonusFromCache = true;
    }

    this.checkForDataOnHomeScreen();

  }

  loadFavorites(id, token) {

    this.favoritesFromCache = false;

    if (id && token) {

      this.activeRequests += 1;
      this.favoritesService.getFavorites(id, token).subscribe((res) => {
          this.activeRequests -= 1;
          this.loadFavoritesByPfArray(res);
        },
        error => {
          console.log(error);
          this.activeRequests -= 1;
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
      this.savePartnersService.saveFavoriteList(favoritesByPf);
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

          }

          this.waitingForResults = false;
          this.checkForDataOnHomeScreen();

        },
        error => {
          console.log(error);
          this.waitingForResults = false;
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

    let cachedFavoritesArray = SavePartnersService.loadFavoritePartners();
    if (cachedFavoritesArray.length) {
      this.favoritesFromCache = true;
      for (let pfNumber of cachedFavoritesArray) {

        let rawPartner = SavePartnersService.loadPartner(pfNumber);

        if (rawPartner) {

          let partner = JSON.parse(rawPartner.general);
          partner.logoString = partner.logo;
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

    let lastVisitedPartnersArray = SavePartnersService.loadRecentPartners();

    if (!lastVisitedPartnersArray || lastVisitedPartnersArray.length == 0) {
      this.recentPartners = [];
      this.recentPartnersPeek = [];
      this.hasMoreRecentPartners = false;
      return;
    }

    this.activeRequests += 1;
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

          /* sort response based on stored partner order */
          partnersArray.sort((a, b) => {
            return lastVisitedPartnersArray.indexOf(b.number) - lastVisitedPartnersArray.indexOf(a.number);
          });

          this.recentPartners = partnersArray;
          this.recentPartnersPeek = this.recentPartners.slice(0, 5);
          if (this.recentPartners.length > 5) {
            this.hasMoreRecentPartners = true;
          }


        }

        this.activeRequests -= 1;
        this.waitingForResults = false;
        this.checkForDataOnHomeScreen();

      },
      error => {
        console.log(error);
        this.activeRequests -= 1;
        this.waitingForResults = false;
        this.showRecentPartnersFromCache();
      })

  }

  showRecentPartnersFromCache() {

    this.recentPartners = [];
    this.recentPartnersPeek = [];
    this.hasMoreRecentPartners = false;

    let lastVisitedPartnersArray = SavePartnersService.loadRecentPartners();
    if (lastVisitedPartnersArray.length && lastVisitedPartnersArray.length > 0) {

      let maxIndex = lastVisitedPartnersArray.length - 1;
      for (let i = maxIndex; i > -1; i--) {
        let pfNumber = lastVisitedPartnersArray[i];

        let rawPartner = SavePartnersService.loadPartner(pfNumber);

        if (rawPartner) {

          let partner = JSON.parse(rawPartner.general);
          partner.logoString = partner.logo;
          this.recentPartners.push(partner);

        }

      }

      /* sort response based on stored partner order */
      this.recentPartners.sort((a, b) => {
        return lastVisitedPartnersArray.indexOf(b.number) - lastVisitedPartnersArray.indexOf(a.number);
      });

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
    // TODO JS: warum???
    // Antwort AW wenn das Passwort im Browser geändert wurde, muss der User automatisch ausgeloggt werden
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

  ngAfterViewChecked() {
    this.setFocus();
  }


  loadPartners() {
    this.activeRequests += 1;
    this.getPartnersSubscription = this.partnerService.getPartners(this.location, 0, "", false, "RELEVANCE", "DESC")
      .subscribe(
        body => {

          this.activeRequests -= 1;
          let returnedObject = body.json();
          if(returnedObject) {
            this.extractOnlineAndOfflinePartners(returnedObject);
            this.waitingForResults = false;
          }
        },
        (error) => {

          this.activeRequests -= 1;
          this.waitingForResults = false;
          this.checkForDataOnHomeScreen();

        });
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
      navigatedFromOverview: true,
      showOnlinePartners: true,
      showOfflinePartners: true
    })

  }

  navigateToPartnerDetail(partner = 0) {
    this.navCtrl.push(PartnerDetailComponent, {partner: partner, cached: false})
  }

  navigateToCachedPartnerDetail(partner) {
    let partnerDetails = JSON.parse(SavePartnersService.loadPartner(partner.number).detail);
    this.navCtrl.push(PartnerDetailComponent, {partner: partner, partnerDetails: partnerDetails, cached: true})
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
            if (this.platform.is('android')) {
              window.open('https://play.google.com/store/apps/details?id=de.avs.bswapp', '_system', 'location=yes');
            } else {
              window.open('itms://itunes.apple.com/de/app/apple-store/id597383984?mt=8', '_system', 'location=yes');
            }

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
    this.externalSiteService.gotToExternalSite('VorteilsuebersichtWebviewUrl', 'Vorteilsübersicht');
  }

//pure DOM method(s)

  heightBlueBarRedBar() {
    let heightOtherDiv;
    if (this.bonusBalance > this.bonusThisYear) {
      this.heightBalanceBarBonusBarBuffer[0] = this.maxHeightBarInVh;
      heightOtherDiv = Math.max(Math.round((this.bonusThisYear / this.bonusBalance) * this.maxHeightBarInVh), 1);
      this.heightBalanceBarBonusBarBuffer[1] = heightOtherDiv;
      this.heightBalanceBarBonusBarBuffer[3] = this.maxHeightBarInVh - heightOtherDiv;
    }
    else {
      this.heightBalanceBarBonusBarBuffer[1] = this.maxHeightBarInVh;
      heightOtherDiv = Math.max(Math.round((this.bonusBalance / this.bonusThisYear) * this.maxHeightBarInVh), 1);
      this.heightBalanceBarBonusBarBuffer[0] = heightOtherDiv;
      this.heightBalanceBarBonusBarBuffer[2] = this.maxHeightBarInVh - heightOtherDiv;
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
