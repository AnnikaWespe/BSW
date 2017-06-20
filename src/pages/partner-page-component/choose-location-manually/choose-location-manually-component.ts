import {Component} from '@angular/core';
import {AlertController, NavController, NavParams, ViewController} from "ionic-angular";
import {LocationService} from "../../../services/location-service";
import {NativeGeocoderForwardResult, NativeGeocoder} from "@ionic-native/native-geocoder";

declare let google: any;

@Component({
  selector: 'choose-location-manually',
  templateUrl: 'choose-location-manually-component.html'
})
export class ChooseLocationManuallyComponent {

  latitude: number;
  longitude: number;
  cityName: string;
  latitudeCenter = 51.1656;
  longitudeCenter = 10.4515;
  markerVisible = true;
  checkButtonVisible = false;
  zoom: number = 6;
  title = 'Standort auswählen';
  locationExact: boolean;
  searchTerm;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private locationService: LocationService,
              private viewCtrl: ViewController,
              private nativeGeocoder: NativeGeocoder,
              private alertCtrl: AlertController) {
    let latitude = localStorage.getItem("latitude") || "52.5219";
    let longitude = localStorage.getItem("longitude") || "13.4132";
    this.latitude = parseFloat(latitude);
    this.longitude = parseFloat(longitude);
  }

  mapClicked($event: any) {
    this.checkButtonVisible = true;
    this.markerVisible = true;
    this.longitude = parseFloat($event.coords.lng.toFixed(4));
    this.latitude = parseFloat($event.coords.lat.toFixed(4));
    console.log(this.longitude + " " + this.latitude);
    this.locationExact = true;
    this.locationService.getLocationName(this.latitude, this.longitude).subscribe(
      (name) => {
        this.searchTerm = name;
      },
      (err) => {
        this.searchTerm = "manuell gewählter Ort"
      });
    this.setLocationData();
  }

  setLocationData() {
    localStorage.setItem("latitude", this.latitude.toString());
    localStorage.setItem("longitude", this.longitude.toString());
    localStorage.setItem("locationAvailable", "true");
    localStorage.setItem("locationExact", "true");
    localStorage.setItem("locationName", this.searchTerm);
  }

  somethingTypedInInputField(event) {
    if (event.keyCode == 13) {
      this.locationExact = false;
      this.nativeGeocoder.forwardGeocode(this.searchTerm)
        .then((coordinates: NativeGeocoderForwardResult) => {
          console.log(coordinates.latitude, coordinates.longitude)
          this.longitude = parseFloat(coordinates.latitude);
          this.latitude = parseFloat(coordinates.longitude);
          this.setLocationData();
          this.checkButtonVisible = true;
        })
        .catch((error: any) => {
          this.alertSomethingWrentWrong();
          this.latitude = parseFloat(53.5510846.toFixed(4));
          this.longitude = parseFloat(9.9936818.toFixed(4));
          this.setLocationData();
        });
    }
  }

  alertSomethingWrentWrong() {
    let alert = this.alertCtrl.create({
      title: 'Etwas ist schiefgelaufen',
      subTitle: 'Bitte versuchen Sie es erneut.',
      buttons: ['Ok']
    });
    alert.present();
  }

  saveLocation() {

    this.viewCtrl.dismiss({latitude: this.latitude, longitude: this.longitude, name: this.searchTerm});

  }

  backButtonClicked() {
    this.viewCtrl.dismiss();
  }

  parseFloat(string) {
    return parseFloat(string);
  }


}
