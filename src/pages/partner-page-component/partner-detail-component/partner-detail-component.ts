import {Component} from '@angular/core';
import {AlertController, NavController, NavParams, ModalController} from 'ionic-angular';
import {PartnerDetailMap} from "./partner-detail-map/partner-detail-map";
import {FavoritesData} from "../../../services/favorites-data";
import {FavoritesService} from "../../../services/favorites-service";
import {LoginPageComponent} from "../../login-page-component/login-component";

@Component({
  selector: 'page-partner-detail-component',
  templateUrl: 'partner-detail-component.html'
})
export class PartnerDetailComponent {

  partner: any;
  pfNumber: string;
  isInFavorites = true;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public favoritesService: FavoritesService,
              public alertCtrl: AlertController,
              public modalCtrl: ModalController) {
    this.partner = this.navParams.get("partner");
    console.log(this.partner);
    //TODO uncomment
    //this.pfNumber = this.partner.number;
    //this.isInFavorites = FavoritesData.isInFavorites(this.pfNumber);
  }

  goToPartnerDetailMap() {
    this.navCtrl.push(PartnerDetailMap, {partner: this.partner});
  }

  checkIfUserLoggedIn() {
    if (localStorage.getItem("securityToken")) {
      console.log("you're logged in")
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
            let profileModal = this.modalCtrl.create(LoginPageComponent, { navigatedFromPartnerDetail: true });
            profileModal.onDidDismiss(data => {
              console.log(data);
            });
            profileModal.present();
          }
        },
        {
          text: 'Trotzdem zum Shop',
          handler: () => {
            console.log('Buy clicked');
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
          FavoritesData.deleteFavorite("35280000");
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
          FavoritesData.addFavorite("35280000");
          this.isInFavorites = true;
        }
        else {
          this.showPromptSomethingWentWrong();
        }
      })
    }
  }
}
