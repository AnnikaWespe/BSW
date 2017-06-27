import {Component, OnDestroy} from '@angular/core';
import {AlertController, NavController, NavParams, ViewController, Keyboard} from "ionic-angular";
import {LocationService} from "../../../services/location-service";
import {NativeGeocoderForwardResult, NativeGeocoder} from "@ionic-native/native-geocoder";

declare let google: any;

@Component({
  selector: 'choose-location-manually',
  templateUrl: 'choose-location-manually-component.html'
})
export class ChooseLocationManuallyComponent implements OnDestroy{

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
  locationNameInInputField;
  mapClickedSubscription;
  nameEnteredSubscription;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private locationService: LocationService,
              private viewCtrl: ViewController,
              private nativeGeocoder: NativeGeocoder,
              private alertCtrl: AlertController,
              private keyboard: Keyboard) {
    let latitude = localStorage.getItem("latitude") || "52.5219";
    let longitude = localStorage.getItem("longitude") || "13.4132";
    this.latitude = parseFloat(latitude);
    this.longitude = parseFloat(longitude);
  }

  ngOnDestroy(){
    if(this.mapClickedSubscription){
      this.mapClickedSubscription.unsubscribe();
    }
    if(this.nameEnteredSubscription){
      this.nameEnteredSubscription.unsubscribe();
    }
  }

  mapClicked($event: any) {
    this.checkButtonVisible = true;
    this.markerVisible = true;
    this.longitude = parseFloat($event.coords.lng.toFixed(4));
    this.latitude = parseFloat($event.coords.lat.toFixed(4));
    this.locationExact = true;
    this.mapClickedSubscription = this.locationService.getLocationName(this.latitude, this.longitude).subscribe(
      (name) => {
        console.log(name);
        this.locationNameInInputField = name;
      },
      (err) => {
        localStorage.setItem("cityName", "Manuell gewählter Ort");
        this.locationNameInInputField = "manuell gewählter Ort"
      });
    this.setLocationData("true");
  }

  setLocationData(locationExact) {
    localStorage.setItem("latitude", this.latitude.toString());
    localStorage.setItem("longitude", this.longitude.toString());
    localStorage.setItem("locationAvailable", "true");
    localStorage.setItem("locationExact", locationExact);
    localStorage.setItem("locationName", this.locationNameInInputField);
  }

  somethingTypedInInputField(event) {
    this.checkButtonVisible = false;
    if (event.keyCode == 13) {
      this.locationExact = false;
      this.keyboard.close();
      this.nameEnteredSubscription = this.locationService.getLocationCoordinates(this.locationNameInInputField).subscribe((data) => {
        console.log("data", data);
        this.longitude = data.longitude;
        this.latitude = data.latitude;
        this.setLocationData("false");
        this.checkButtonVisible = true;
      }, (error) => {
        this.alertSomethingWrentWrong();
      })
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
    this.viewCtrl.dismiss({latitude: this.latitude, longitude: this.longitude, name: this.locationNameInInputField});
  }

  backButtonClicked() {
    this.viewCtrl.dismiss();
  }

}
