import {Component, OnDestroy} from '@angular/core';
import {AlertController, NavController, NavParams, ModalController} from 'ionic-angular';
import {PartnerDetailMap} from "./partner-detail-map/partner-detail-map";
import {FavoritesData} from "../../../services/favorites-data";
import {FavoritesService} from "../../../services/favorites-service";
import {LoginPageComponent} from "../../login-page-component/login-component";
import {GoogleAnalytics} from "@ionic-native/google-analytics";
import {PartnerDetailService} from "./partner-detail-map/partner-detail-service";
import {MapMarkerService} from "../../../services/map-marker-service";
import {SavePartnersService} from "./save-partners-service";
import {AuthService} from "../../../services/auth-service";

declare let window: any;
declare let cordova: any;

@Component({
  selector: 'page-partner-detail-component',
  templateUrl: 'partner-detail-component.html'
})
export class PartnerDetailComponent implements OnDestroy {

  partner: any;
  cached: any;
  pfNumber: string;
  partnerDetails: any;
  isInFavorites = false;
  favoritesByPfArray;
  partnerDetailsSubscription;
  showDetails = true;
  zmIcons = [];
  securityToken;
  isLoading = true;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public favoritesService: FavoritesService,
              public alertCtrl: AlertController,
              public modalCtrl: ModalController,
              private ga: GoogleAnalytics,
              private partnerDetailService: PartnerDetailService,
              private mapMarkerService: MapMarkerService,
              public authService: AuthService,
              private savePartnersService: SavePartnersService) {
    this.setParameters();
    if (!this.partnerDetails) {
      this.getPartnerDetails();
    }
    else {
      this.getZmicons();
      this.isLoading = false;
    }
    this.googleAnalyticsTrackingOpenDetailScreen();

  }

  ngOnDestroy() {
    if (this.partnerDetailsSubscription) {
      this.partnerDetailsSubscription.unsubscribe;
    }
  }

  setParameters() {
    this.partner = this.navParams.get("partner");
    this.partnerDetails = this.navParams.get("partnerDetails");
    this.cached = this.navParams.get("cached");
    this.pfNumber = this.partner.number;
    this.securityToken = this.authService.getUser().securityToken;
    this.favoritesByPfArray = FavoritesData.favoritesByPfArray;
    if (this.favoritesByPfArray) {
      this.isInFavorites = FavoritesData.isInFavorites(this.pfNumber);
    }
  }

  getPartnerDetails() {

    this.partnerDetailsSubscription = this.partnerDetailService.getDetails(this.pfNumber).subscribe((res) => {
      if (res.json().errors[0].beschreibung === "Erfolg") {
        this.partnerDetails = res.json().response;
        this.getZmicons();
        console.log(this.partnerDetails);
        if (this.partnerDetails.aktionen) {
          this.showDetails = false;
        }
        this.saveForOffline();
        this.isLoading = false;
      }
      else {
        this.isLoading = false;
        this.alertSomethingWentWrong();
      }
    }, (error) => {
      this.isLoading = false;
      this.alertSomethingWentWrong();
    });

  }

  getZmicons() {
    let zmArray = this.partnerDetails.bezahlarten;
    if (zmArray && zmArray.length) {
      zmArray.forEach((zm) => {
        let iconUrl = localStorage.getItem("zmicon_" + zm.bezahlartStyle + "WebviewUrl");
        if (iconUrl) {
          this.zmIcons.push(iconUrl)
        }
      })
    }
  }

  alertSomethingWentWrong() {
    let prompt = this.alertCtrl.create({
      title: 'Leider ist der Aufruf fehlgeschlagen.',
      message: "Wollen Sie es erneut versuchen?",
      buttons: [
        {
          text: 'Ja',
          handler: data => {
            this.getPartnerDetails();
          }
        },
        {
          text: 'Nein, zurück zur Übersicht',
          handler: data => {
            this.navCtrl.pop();
          }
        }
      ]
    });
    prompt.present();
  }

  googleAnalyticsTrackingOpenDetailScreen() {
    if (localStorage.getItem("disallowUserTracking") === "false") {
      this.ga.trackView("Partner Detail Screen");
      this.ga.trackEvent("Partner Detail Seite", "pf-Nummer: " + this.pfNumber + ", Name: " + this.partner.nameOrigin)
    }
  }

  googleAnalyticsTrackingGoToShop() {
    if (localStorage.getItem("disallowUserTracking") === "false") {
      this.ga.trackEvent("Online Shop geöffnet", "pf-Nummer: " + this.pfNumber + ", Name: " + this.partner.nameOrigin, this.authService.getUser().mitgliedId)
    }
  }

  goToPartnerDetailMap() {
    this.navCtrl.push(PartnerDetailMap, {partnerDetails: this.partnerDetails, partner: this.partner, cached: this.cached});
  }

  goToPartnerShop(goEvenIfUserNotLoggedIn) {
    if (this.authService.getUser().securityToken || goEvenIfUserNotLoggedIn) {
      let url = this.partnerDetails.trackingUrl
      if (!goEvenIfUserNotLoggedIn) {
        let mitgliedsnummer = this.authService.getUser().mitgliedsnummer;
        url = url
          .replace("#MGNUMMER#", mitgliedsnummer)
          .replace("AVS9StAVS1St", mitgliedsnummer)
      }
      let openUrl: any;
      try {
        openUrl = cordova.InAppBrowser.open;
      } catch (error) {
        openUrl = open;
      }
      console.log(url)
      openUrl(url, '_system', 'location=yes');
      this.googleAnalyticsTrackingGoToShop();
    }
    else {
      this.showPromptUserNotLoggedIn();
    }
  }

  showPromptSomethingWentWrong() {
    let prompt = this.alertCtrl.create({
      title: 'Tut uns leid, etwas ist schiefgegangen',
      message: "Bitte überprüfen Sie gegebenenfalls Ihr Netzwerk, und versuchen Sie es dann erneut.",
      buttons: [
        {
          text: 'Ok',
          handler: data => {
          }
        }
      ]
    });
    prompt.present();
  }

  showPromptUserNotLoggedIn() {
    let alert = this.alertCtrl.create({
      title: 'Sie sind nicht eingeloggt.',
      message: 'Der BSW Vorteil kann Ihnen nur gewährt werden, wenn Sie eingeloggt sind.',
      buttons: [
        {
          text: 'Abbrechen',
          role: 'cancel',
        },
        {
          text: 'Jetzt einloggen',
          handler: () => {
            let profileModal = this.modalCtrl.create(LoginPageComponent, {navigatedFromPartnerDetail: true});
            profileModal.onDidDismiss(() => {
              this.goToPartnerShop(false);
            });
            profileModal.present();
          }
        }
      ]
    });
    alert.present();
  }


  toggleFavorites() {
    if (this.isInFavorites) {
      this.favoritesService.deleteFavorite(this.pfNumber).subscribe((res) => {
        let message = res.json().errors[0].beschreibung;
        if (message === "Erfolg") {
          FavoritesData.deleteFavorite(this.pfNumber);
          this.isInFavorites = false;
          this.savePartnersService.removeFromFavorites(this.pfNumber);
        }
        else {
          this.showPromptSomethingWentWrong();
        }
      }, () => {
        this.showPromptSomethingWentWrong();
      })
    }
    else {
      this.favoritesService.rememberFavorite(this.pfNumber).subscribe((res) => {
        let message = res.json().errors[0].beschreibung;
        if (message === "Erfolg") {
          FavoritesData.addFavorite(this.pfNumber);
          this.isInFavorites = true;
          this.savePartnersService.addToFavorites(this.pfNumber);
        }
        else {
          this.showPromptSomethingWentWrong();
        }
      }, () => {
        this.showPromptSomethingWentWrong();
      })
    }
  }

  saveForOffline() {

    if (this.partnerDetails.aktionen && this.partnerDetails.aktionen[0].bildUrl) {
      this.mapMarkerService.getImageAsBase64("PartnerDetailComponent", this.partnerDetails.aktionen[0].bildUrl, (imageAsBase64, validImage) => {
        SavePartnersService.saveCampaignImage(this.pfNumber, imageAsBase64);
      })
    }

    this.mapMarkerService.getImageAsBase64("PartnerDetailComponent", this.partner.logoUrl, (imageAsBase64, validImage) => {
      SavePartnersService.saveLogo(this.pfNumber, imageAsBase64);
    })

    this.savePartnersService.storePartnerAndPartnerDetails(this.pfNumber, this.partner, this.partnerDetails)

  }

}
