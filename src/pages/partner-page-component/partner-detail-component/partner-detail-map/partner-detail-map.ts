import {Component} from '@angular/core';
import {AlertController, NavController, NavParams} from 'ionic-angular';
import {FavoritesData} from "../../../../services/favorites-data";
import {FavoritesService} from "../../../../services/favorites-service";
import {SavePartnersService} from "../save-partners-service";
import {AuthService} from "../../../../services/auth-service";
import {LocationService} from "../../../../services/location-service";

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

  location: any;
  currentLatitude: number;
  currentLongitude: number;
  locationExact = false;


  partnerDetails: any;
  partner: any;
  pfNumber: string;
  isInFavorites = true;
  securityToken;
  favoritesByPfArray;
  cached: any;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public favoritesService: FavoritesService,
              public alertCtrl: AlertController,
              public authService: AuthService,
              private savePartnersService: SavePartnersService,
              private locationService: LocationService) {
    this.partnerDetails = navParams.get("partnerDetails");
    this.partner = navParams.get("partner");
    this.cached = this.navParams.get("cached");
    this.securityToken = this.authService.getUser().securityToken;
    this.favoritesByPfArray = FavoritesData.favoritesByPfArray;
    console.log(this.partnerDetails);

    this.location = this.locationService.getLocation();
    if (this.location) {
      this.currentLatitude = this.location.latitude;
      this.currentLongitude = this.location.longitude;
      this.locationExact = true;
    }

    console.log("PartnerDetailMap: ", this.currentLatitude + " " + this.currentLongitude);
    this.pfNumber = this.partnerDetails.pfNummer;
    console.log(this.pfNumber);
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
          this.isInFavorites = false;
          this.savePartnersService.removeFromFavorites(this.pfNumber);
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
          this.savePartnersService.addToFavorites(this.pfNumber);
        }
        else {
          this.showPromptSomethingWentWrong();
        }
      })
    }
  }

  openExternalMapApp() {
    if (device.platform == "Android") {
      let link = "geo:" + this.currentLatitude + "," + this.currentLongitude + "?q=" + this.partnerDetails.latitude + "," + this.partnerDetails.longitude + "(" + this.partnerDetails.nameInternet + ")";
      console.log(link);
      window.open(link, '_system', 'location=yes');
    }
    else {
      let currentLocationString = "";
      if(this.locationExact){
        currentLocationString = "saddr=" + this.currentLatitude + "," + this.currentLongitude + "&";
      }
      window.open("http://maps.apple.com/?" + currentLocationString + "daddr=" + this.partnerDetails.latitude + "," + this.partnerDetails.longitude, '_system', 'location=yes');
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
