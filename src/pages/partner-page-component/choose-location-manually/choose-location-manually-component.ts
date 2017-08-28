import {Component, OnDestroy} from '@angular/core';
import {AlertController, NavController, NavParams, ViewController, Keyboard, LoadingController} from "ionic-angular";
import {LocationService} from "../../../services/location-service";
import {NativeGeocoderForwardResult, NativeGeocoder} from "@ionic-native/native-geocoder";

declare let google: any;

@Component({
  selector: 'choose-location-manually',
  templateUrl: 'choose-location-manually-component.html'
})
export class ChooseLocationManuallyComponent implements OnDestroy {
  latitude: number;
  longitude: number;
  locationName: string;
  locationExact: boolean;
  locationNameInInputField;
  latitudeCenter = 51.1656;
  longitudeCenter = 10.4515;
  markerVisible = true;
  checkButtonVisible = false;
  zoom: number = 6;
  title = 'Standort auswählen';
  mapClickedSubscription;
  nameEnteredSubscription;
  needsGeocoding = false;
  platformSubscription: any;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private locationService: LocationService,
              private viewCtrl: ViewController,
              private nativeGeocoder: NativeGeocoder,
              private alertCtrl: AlertController,
              private keyboard: Keyboard,
              public loadingCtrl: LoadingController) {

    let location = this.locationService.getCurrentLocation();
    this.latitude = location.latitude;
    this.longitude = location.longitude;
    this.locationExact = location.locationExact;
    this.locationNameInInputField = location.locationName;
    this.locationName = location.locationName;
  }

  ngOnDestroy() {
    if (this.mapClickedSubscription) {
      this.mapClickedSubscription.unsubscribe();
    }
    if (this.nameEnteredSubscription) {
      this.nameEnteredSubscription.unsubscribe();
    }
  }

  mapClicked($event: any) {
    this.checkButtonVisible = true;
    this.markerVisible = true;
    this.longitude = parseFloat($event.coords.lng.toFixed(4));
    this.latitude = parseFloat($event.coords.lat.toFixed(4));
    this.locationExact = true;
    this.mapClickedSubscription = this.locationService.getLocationName({
      latitude: this.latitude,
      longitude: this.longitude
    }).subscribe(
      (name) => {
        this.locationName = name;
      }
    );

  }

  setLocationData() {

    this.locationService.setLocation({
      longitude: this.longitude,
      latitude: this.latitude,
      locationName: this.locationName
    })

  }

  somethingTypedInInputField(event) {
    this.checkButtonVisible = false;
    if (event.keyCode == 13) {
      this.needsGeocoding = false;
      this.locationExact = false;
      this.keyboard.close();

      this.geocodeForName(this.locationName, false);

    } else {

      this.needsGeocoding = true;

    }
  }

  geocodeForName(name, close: boolean) {

    let loader = this.loadingCtrl.create({
      content: "Bitte warten..."
    });
    loader.present();

    this.nameEnteredSubscription = this.locationService.getLocationCoordinates(name)
      .subscribe((data) => {

        loader.dismiss();

        if (!data) {
          this.alertSomethingWrentWrong();
          return;
        }

        console.log("data", data);
        this.longitude = data.longitude;
        this.latitude = data.latitude;
        this.checkButtonVisible = true;

        if (close) {
          this.setLocationData();
          this.navCtrl.pop();
        }

      }, (error) => {
        loader.dismiss();
        this.alertSomethingWrentWrong();
      })

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

    if (this.needsGeocoding) {

      this.needsGeocoding = false;
      this.geocodeForName(this.locationName, true);

    } else {

      this.setLocationData();
      this.navCtrl.pop();

    }

  }

}
