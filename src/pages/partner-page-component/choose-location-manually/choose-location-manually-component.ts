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

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private locationService: LocationService,
              private viewCtrl: ViewController,
              private nativeGeocoder: NativeGeocoder,
              private alertCtrl: AlertController,
              private keyboard: Keyboard) {
    
    this.locationService.getLocation().subscribe((location) => {
      this.latitude = location.latitude;
      this.longitude = location.longitude;
      this.locationExact = location.locationExact;
      this.locationNameInInputField = location.locationName;
      this.locationName = location.locationName;
    }).unsubscribe();
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
      this.locationExact = false;
      this.keyboard.close();
      this.nameEnteredSubscription = this.locationService.getLocationCoordinates(this.locationName)
      .subscribe((data) => {
        if (!data) {
          this.alertSomethingWrentWrong();
          return;
        }
        console.log("data", data);
        this.longitude = data.longitude;
        this.latitude = data.latitude;
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
    this.setLocationData();
    this.navCtrl.pop();
  }

  backButtonClicked() {
    this.viewCtrl.dismiss();
  }

}
