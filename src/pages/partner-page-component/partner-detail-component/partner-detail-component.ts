import {Component} from '@angular/core';
import {AlertController, NavController, NavParams, ModalController} from 'ionic-angular';
import {PartnerDetailMap} from "./partner-detail-map/partner-detail-map";
import {FavoritesData} from "../../../services/favorites-data";
import {FavoritesService} from "../../../services/favorites-service";
import {LoginPageComponent} from "../../login-page-component/login-component";
import {GoogleAnalytics} from "@ionic-native/google-analytics";
import {PartnerDetailService} from "./partner-detail-map/partner-detail-service";

declare let window: any;

@Component({
  selector: 'page-partner-detail-component',
  templateUrl: 'partner-detail-component.html'
})
export class PartnerDetailComponent {

  partner: any;
  pfNumber: string;
  partnerDetails: any;
  isInFavorites = false;
  favoritesByPfArray;
  partnerDetailsSubscription;
  showDetails = true;


  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public favoritesService: FavoritesService,
              public alertCtrl: AlertController,
              public modalCtrl: ModalController,
              private ga: GoogleAnalytics,
              private partnerDetailService: PartnerDetailService) {
    this.partner = this.navParams.get("partner");
    console.log("partner:", this.partner);
    this.pfNumber = this.partner.number;
    this.favoritesByPfArray = FavoritesData.favoritesByPfArray;
    if(this.favoritesByPfArray){
      this.isInFavorites = FavoritesData.isInFavorites(this.pfNumber);
    }
    this.partnerDetailsSubscription = partnerDetailService.getDetails(this.pfNumber).subscribe((res) => {
      if(res.json().errors[0].beschreibung === "Erfolg"){
        this.partnerDetails = res.json().response;
        console.log(this.partnerDetails);
        if(this.partnerDetails.aktionen){
          this.showDetails = false;
          this.saveCampaignPictureAsBlob();
        }
        this.saveDetailLogoPictureAsBlob();
      }
      else{
        //TODO Error handling
      }
    });

    if (localStorage.getItem("disallowUserTracking") === "false") {
      this.ga.trackView("Partner Detail Screen");
      this.ga.trackEvent("Partner Detail Seite", "pf-Nummer: " + this.pfNumber + ", Name: " + this.partner.nameOrigin)
    }
    this.saveForOffline();
  }

  goToPartnerDetailMap() {
    this.navCtrl.push(PartnerDetailMap, {partner: this.partner});
  }

  checkIfUserLoggedIn() {
    if (localStorage.getItem("securityToken")) {
      let mitgliedsNummer = localStorage.getItem("mitgliedsnummer");
      let url = this.partnerDetails.trackingUrl
        .replace("#MGNUMMER#", "0016744807")
        .replace("AVS9StAVS1St", "0016744807")
        .replace("AVSMGNR9ST", "0016744807")
        .replace("AVSMGPZ1ST", "0016744807");
      window.open(url, '_system', 'location=yes')
    }
    else {
      this.showPromptUserNotLoggedIn();
    }
  }

  showPromptSomethingWentWrong() {
    let prompt = this.alertCtrl.create({
      title: 'Tut uns leid, etwas ist schiefgegangen',
      message: "Bitte versuchen Sie es erneut.",
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
      message: 'Der BSW Bonus kann Ihnen nur angerechnet werden, wenn Sie eingeloggt sind.',
      buttons: [
        {
          text: 'Abbrechen',
          role: 'cancel',
        },
        {
          text: 'Jetzt einloggen',
          handler: () => {
            let profileModal = this.modalCtrl.create(LoginPageComponent, {navigatedFromPartnerDetail: true});
            profileModal.onDidDismiss(data => {
              //TODO: navigate to partner page and track event with GA; differ between case where data is passed on or not

              if (data) {
              }
              else {
              }

            });
            profileModal.present();
          }
        },
        {
          text: 'Trotzdem zum Shop',
          handler: () => {
            //TODO: navigate to partner page and track event with GA

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
        }
        else {
          this.showPromptSomethingWentWrong();
        }
      })
    }
    else {
      this.favoritesService.rememberFavorite(this.pfNumber).subscribe((res) => {
        let message = res.json().errors[0].beschreibung;
        if (message === "Erfolg") {
          FavoritesData.addFavorite(this.pfNumber);
          this.isInFavorites = true;
        }
        else {
          this.showPromptSomethingWentWrong();
        }
      })
    }
  }

  saveCampaignPictureAsBlob(){}
  saveDetailLogoPictureAsBlob(){}
  saveForOffline(){

  }
}
