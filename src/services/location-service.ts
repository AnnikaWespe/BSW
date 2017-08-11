import {Injectable} from '@angular/core';
import {Http, Response} from '@angular/http';
import {Geolocation} from '@ionic-native/geolocation';

import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/fromPromise';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {NativeGeocoder, NativeGeocoderForwardResult, NativeGeocoderReverseResult} from "@ionic-native/native-geocoder";


@Injectable()
export class LocationService {
  private latitude;
  private longitude;
  private location: BehaviorSubject<any>;

  constructor(private http: Http, private geolocation: Geolocation, private nativeGeocoder: NativeGeocoder) {
    let currentLocation = JSON.parse(localStorage.getItem('location'));
    let updateLocation = false;
    if (!currentLocation) {
      currentLocation = {
        latitude: "52.5219",
        longitude: "13.4132",
        locationExact: false,
        locationAvailable: false,
        locationfound: true,
        locationName: 'Berlin',
        cityName: 'Zuletzt verfügbarer Standort',
        fromGPS: false
      };
      updateLocation = true;
    } else {
      if (currentLocation.fromGPS) {
        updateLocation = true;
      }
    }
    this.location = new BehaviorSubject(currentLocation);
    if (updateLocation) {
      this.updateLocation();
    }
  }

  getLocation(): Observable<any> {
    return this.location;
  }

  setLocation(currentLocation: any) {
    if (!currentLocation.longitude || !currentLocation.latitude) {
      return;
    }
    currentLocation.locationFound = true;
    currentLocation.locationAvailable = currentLocation.locationAvailable || true;
    currentLocation.locationExact = currentLocation.locationExact || true;
    currentLocation.fromGPS = false;
    this.getLocationName(currentLocation).subscribe((cityName) => {
      currentLocation.cityName = cityName;
      currentLocation.locationName = cityName;
      localStorage.setItem('location', JSON.stringify(currentLocation));
      this.location.next(currentLocation);
    })
  }

  updateLocation() {
    this.geolocation.getCurrentPosition({timeout: 3000}).then(
      (position) => {
        let currentLocation = {
          latitude: position.coords.latitude.toFixed(4),
          longitude: position.coords.longitude.toFixed(4),
          locationExact: true,
          locationAvailable: true,
          locationfound: true,
          fromGPS: true,
          locationName: '',
          cityName: ''
        };
        this.getLocationName(location).subscribe((cityName) => {
          currentLocation.cityName = cityName;
          currentLocation.locationName = cityName;
          localStorage.setItem('location', JSON.stringify(currentLocation));
          this.location.next(currentLocation);
        })
      },
      (error) => {
        console.error(error);
      }
    )
  }

  getLocationName(location: any): Observable<any> {
    return Observable.fromPromise(this.nativeGeocoder.reverseGeocode(location.latitude, location.longitude)
      .then((result: NativeGeocoderReverseResult) => {
        let cityname = result.city;
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

