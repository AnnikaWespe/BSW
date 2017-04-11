import {Injectable} from '@angular/core';
import {Http, Response} from '@angular/http';
import {Geolocation} from '@ionic-native/geolocation';

import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/fromPromise';
import {LocationData} from "./location-data";
import {BehaviorSubject, Subject} from "rxjs";


@Injectable()
export class LocationService {
  private getLocationNameUrl = 'http://maps.googleapis.com/maps/api/geocode/json?latlng=';
  private latitude;
  private longitude;

  constructor(private http: Http, private geolocation: Geolocation) {}


  getLocation(): Observable<any> {
    return Observable.fromPromise(
      this.geolocation.getCurrentPosition().then((position) => {
        let latitude = position.coords.latitude.toFixed(4);
        let longitude = position.coords.longitude.toFixed(4);
        localStorage.setItem("latitude", latitude);
        localStorage.setItem("longitude", longitude);
        localStorage.setItem("locationAvailable", "true");
        return {lat: latitude, lon: longitude, locationFound: true};
      }, (err) => {
        return {lat: "0", lon: "0", locationFound: false};
      })
    )
  }

  getLocationName(lat, lon): Observable <any> {
    let url = this.getLocationNameUrl + lat + "," + lon + '&sensor=true';
    console.log(url);
    return this.http.get(url)
      .map(this.extractData)
      .catch(this.handleError);
  }


  extractData(res: Response) {
    let cityName;
    for (let result of res.json().results) {
      for (let addressComponent of result.address_components) {
        if (addressComponent.types.indexOf("administrative_area_level_3") > -1) {
          cityName = addressComponent.long_name;
          break;
        }
      }
    }
    console.log(cityName);
    localStorage.setItem("cityName", cityName);
    return cityName;
  }

  private handleError(error: Response | any) {
    //TODO: In a real world app, we might use a remote logging infrastructure
    let errMsg: string;
    console.log("error");
    localStorage.setItem("cityName", "Manuell gewählter Ort");
    if (error instanceof Response) {
      const body = error.json() || '';
      const err = body.error || JSON.stringify(body);
      errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
    } else {
      errMsg = error.message ? error.message : error.toString();
    }
    console.error(errMsg);
    return Observable.throw(errMsg);
  }
}
