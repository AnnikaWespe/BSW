import {Injectable} from '@angular/core';
import {Http, Response} from '@angular/http';
import {Geolocation} from '@ionic-native/geolocation';

import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/fromPromise';
import {NativeGeocoder, NativeGeocoderForwardResult, NativeGeocoderReverseResult} from "@ionic-native/native-geocoder";


@Injectable()
export class LocationService {
  private latitude;
  private longitude;

  constructor(private http: Http, private geolocation: Geolocation, private nativeGeocoder: NativeGeocoder) {
  }


  getLocation(): Observable<any> {
    return Observable.fromPromise(
      this.geolocation.getCurrentPosition({timeout: 3000}).then((position) => {
        let latitude = position.coords.latitude.toFixed(4);
        let longitude = position.coords.longitude.toFixed(4);
        localStorage.setItem("latitude", latitude);
        localStorage.setItem("longitude", longitude);
        localStorage.setItem("locationExact", "true");
        localStorage.setItem("locationAvailable", "true");
        localStorage.setItem("cityName", "Zuletzt verfügbarer Standort");
        return {lat: latitude, lon: longitude, locationFound: true};
      }, (err) => {
        return {locationFound: false};
      })
    )
  }


  getLocationName(lat, lon): Observable<any> {
    return Observable.fromPromise(this.nativeGeocoder.reverseGeocode(lat, lon)
      .then((result: NativeGeocoderReverseResult) => {
        let cityname = result.city;
        localStorage.setItem("cityName", cityname);
        return cityname;
      }).catch(() => {
        return "zuletzt verfügbarer Standort";
      }))

  }

  getLocationCoordinates(locationName): Observable<any> {
    return Observable.fromPromise(this.nativeGeocoder.forwardGeocode(locationName)
      .then((coordinates: NativeGeocoderForwardResult) => {
        let longitude = parseFloat(parseFloat(coordinates.longitude).toFixed(4));
        let latitude = parseFloat(parseFloat(coordinates.latitude).toFixed(4));
        return {latitude: latitude, longitude: longitude};
      }).catch(() => {
      }))

  }
}

