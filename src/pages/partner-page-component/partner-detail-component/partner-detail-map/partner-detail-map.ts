import {Component} from '@angular/core';
import {AlertController, NavController, NavParams} from 'ionic-angular';
import {FavoritesData} from "../../../../services/favorites-data";
import {FavoritesService} from "../../../../services/favorites-service";
import {SavePartnersService} from "../save-partners-service";

declare let device: any;


@Component({
  selector: 'page-partner-detail-map',
  templateUrl: 'partner-detail-map.html'
})
export class PartnerDetailMap {

  travelTimePublic: string;
  travelTimeCar: string;
  travelTimePedestrian: string;
  travelTimeAvailable = false;

  currentLatitude: number;
  currentLongitude: number;
  locationExact = false;


  partnerDetails: any;
  partner: any;
  pfNumber: string;
  isInFavorites = true;


  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public favoritesService: FavoritesService,
              public alertCtrl: AlertController,
              private savePartnersService: SavePartnersService) {
    this.partnerDetails = navParams.get("partnerDetails");
    this.partner = navParams.get("partner");
    console.log(this.partnerDetails);
    if (localStorage.getItem("locationExact") === "true") {
      this.currentLatitude = parseFloat(localStorage.getItem("latitude"));
      this.currentLongitude = parseFloat(localStorage.getItem("longitude"));
      this.locationExact = true;
    }
    console.log("PartnerDetailMap: ", this.currentLatitude + " " + this.currentLongitude);
    this.pfNumber = this.partnerDetails.pfNummer;
    this.isInFavorites = FavoritesData.isInFavorites(this.pfNumber);
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


  toggleFavorites() {
    if (this.isInFavorites) {
      this.favoritesService.deleteFavorite(this.pfNumber).subscribe((res) => {
        let message = res.json().errors[0].beschreibung;
        if (message === "Erfolg") {
          FavoritesData.deleteFavorite(this.pfNumber);
          this.savePartnersService.togglePartnerType(this.pfNumber, "lastVisitedPartners");
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
          this.savePartnersService.togglePartnerType(this.pfNumber, "favorites");
          this.isInFavorites = true;
        }
        else {
          this.showPromptSomethingWentWrong();
        }
      })
    }
  }

  openExternalMapApp() {
    if (device.platform == "Android") {
      window.open("geo:49,10?q=48,11(Hier wollen Sie hin)", '_system', 'location=yes');
    }
    else {
      window.open("http://maps.apple.com/?saddr=48,11&daddr=49,10");
    }
  }

  handleTravelTimePublicUpdated(travelTimePublic) {
    this.travelTimeAvailable = true;
    this.travelTimePublic = travelTimePublic;
  }

  handleTravelTimeCarUpdated(travelTimeCar) {
    this.travelTimeAvailable = true;
    this.travelTimeCar = travelTimeCar;
  }

  handleTravelTimePedestrianUpdated(travelTimePedestrian) {
    this.travelTimeAvailable = true;
    this.travelTimePedestrian = travelTimePedestrian;
  }
}
