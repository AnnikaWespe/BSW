import {Component, OnDestroy} from '@angular/core';
import {AlertController, NavController, NavParams, Platform} from 'ionic-angular';
import {FavoritesData} from "../../../../services/favorites-data";
import {FavoritesService} from "../../../../services/favorites-service";
import {SavePartnersService} from "../save-partners-service";
import {AuthService} from "../../../../services/auth-service";
import {LocationService} from "../../../../services/location-service";
import {DeviceService} from "../../../../services/device-data";

declare let device: any;

@Component({
  selector: 'page-partner-detail-map',
  templateUrl: 'partner-detail-map.html'
})
export class PartnerDetailMap implements OnDestroy {

  travelTimePublic: string;
  travelTimeCar: string;
  travelTimePedestrian: string;
  travelTimeAvailable = false;

  location: any;


  partnerDetails: any;
  partner: any;
  pfNumber: string;
  isInFavorites = true;
  securityToken;
  favoritesByPfArray;
  cached: any;
  locationSubscriber;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public favoritesService: FavoritesService,
              public alertCtrl: AlertController,
              public authService: AuthService,
              private savePartnersService: SavePartnersService,
              private locationService: LocationService,
              public plt: Platform) {
    this.partnerDetails = navParams.get("partnerDetails");
    this.partner = navParams.get("partner");
    this.cached = this.navParams.get("cached");
    this.securityToken = this.authService.getUser().securityToken;
    this.favoritesByPfArray = FavoritesData.favoritesByPfArray;
    console.log(this.partnerDetails);

    this.locationSubscriber = this.locationService.getLocation().subscribe((loc) => {
      this.location = loc;
    });


    this.pfNumber = this.partnerDetails.pfNummer;
    console.log(this.pfNumber);
    this.isInFavorites = FavoritesData.isInFavorites(this.pfNumber);
  }

  ngOnDestroy() {
    if (this.locationSubscriber) {
      this.locationSubscriber.unsubscribe();
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
    if (DeviceService.isAndroid || DeviceService.isInBrowser) {
      let link = "https://maps.google.com/maps?q=" + this.partnerDetails.strasse + "+" + this.partnerDetails.hausnummer + ",+" + this.partnerDetails.plz + "+" + this.partnerDetails.ort;
      window.open(link, '_system', 'location=yes');
    }
    else {
      let link = "http://maps.apple.com/?daddr=" + this.partnerDetails.strasse + "+" + this.partnerDetails.hausnummer + ",+" + this.partnerDetails.plz + "+" + this.partnerDetails.ort;
      window.open("http://maps.apple.com/?daddr=" + this.partnerDetails.latitude + "," + this.partnerDetails.longitude, '_system', 'location=yes');
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
