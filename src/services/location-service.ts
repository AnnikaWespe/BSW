import {Injectable} from '@angular/core';
import {Http, Response} from '@angular/http';
import {Geolocation} from '@ionic-native/geolocation';

import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/filter';
import 'rxjs/add/observable/fromPromise';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {NativeGeocoder, NativeGeocoderForwardResult, NativeGeocoderReverseResult} from "@ionic-native/native-geocoder";


@Injectable()
export class LocationService {
  private geoLocationSubscription: any;
  private currentLocation: any;
  private location: BehaviorSubject<any>;

  constructor(private http: Http, private geolocation: Geolocation, private nativeGeocoder: NativeGeocoder) {
    let currentLocation = JSON.parse(localStorage.getItem('location'));
    let updateLocation = false;
    if (!currentLocation) {
      currentLocation = {
        latitude: 52.5219,
        longitude: 13.4132,
        locationExact: false,
        locationAvailable: false,
        locationfound: true,
        locationName: 'Berlin',
        fromGPS: false
      };
      updateLocation = true;
    } else {
      if (currentLocation.fromGPS) {
        updateLocation = true;
      }
    }
    this.currentLocation = currentLocation;
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
    this.getLocationName(currentLocation).subscribe((locationName) => {
      currentLocation.locationName = locationName;
      localStorage.setItem('location', JSON.stringify(currentLocation));
      this.location.next(currentLocation);
    })
  }

  updateLocation(watch: boolean = true): Promise<any> {

    const handlePosition = (position, resolve, reject)=> {
      let currentLocation = {
        latitude: parseFloat(position.coords.latitude.toFixed(4)),
        longitude: parseFloat(position.coords.longitude.toFixed(4)),
        locationExact: true,
        locationAvailable: true,
        locationFound: true,
        fromGPS: true,
        locationName: '',
      };
      if (this.currentLocation.latitude === currentLocation.latitude &&
          this.currentLocation.longitude === currentLocation.longitude) {
          resolve(currentLocation);
      } else {
        this.getLocationName(currentLocation).subscribe((locationName) => {
          currentLocation.locationName = locationName;
          localStorage.setItem('location', JSON.stringify(currentLocation));
          this.currentLocation = currentLocation;
          this.location.next(currentLocation);
          resolve(currentLocation);
        })
      }
    };

    const promise = new Promise((resolve, reject) => {
      if (watch && !this.geoLocationSubscription) {
        this.geolocation.getCurrentPosition({timeout: 5000}).then(
          (position) => {
            handlePosition(position, resolve, reject);
            this.geoLocationSubscription = this.geolocation.watchPosition()
              .filter(position => position.coords !== undefined)
              .subscribe(
                (position) => handlePosition(position, () => {}, () => {}),
                (error) => {
                  console.error(error);
                  resolve({fromGPS: false});
                }
              );
          },
          (error) => {
            console.error(error);
            resolve({fromGPS: false});
          }
        )
      } else if (watch && this.geoLocationSubscription) {
        resolve(this.currentLocation);
      } else {
        this.geolocation.getCurrentPosition({timeout: 5000}).then(
          (position) => handlePosition(position, resolve, reject),
          (error) => {
            console.error(error);
            reject({fromGPS: false});
          }
        )
      } 
    })
    return promise;

  }

  getLocationName(location: any): Observable<any> {
    return Observable.fromPromise(this.nativeGeocoder.reverseGeocode(location.latitude, location.longitude)
      .then((result: NativeGeocoderReverseResult) => {
        let locationName = result.city;
        return locationName;
      }).catch(() => {
        return location.latitude+ " / " + location.longitude;
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

