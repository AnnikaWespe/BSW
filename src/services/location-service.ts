import {Injectable} from '@angular/core';
import {Http, Response} from '@angular/http';
import {Geolocation} from 'ionic-native';

import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import {LocationData} from "./location-data";



@Injectable()
export class LocationService {
  private getLocationNameUrl = 'http://maps.googleapis.com/maps/api/geocode/json?latlng=';
  private latitude;
  private longitude;
  constructor(private http: Http) {}


  getLocation(){
    Geolocation.getCurrentPosition().then((position) => {
      this.latitude = position.coords.latitude.toFixed(4);
      this.longitude = position.coords.longitude.toFixed(4);
      LocationData.latitude = this.latitude;
      LocationData.longitude = this.longitude;
      LocationData.locationExact = true;
      LocationData.locationAvailable = true;
      this.getLocationName(this.latitude, this.longitude);
    }, (err) => {
      LocationData.latitude = "13.4132";
      LocationData.longitude = "52.5219";
      LocationData.locationExact = false;
      LocationData.locationAvailable = false;
      return {
        latitude: 13.4132,
        longitude: 52.5219,
        cityName: "Berlin"
      };
    })
  }

  getLocationName(lat, lon): Observable <any> {
    return this.http.get(this.getLocationNameUrl + lat + lon + '&sensor=true')
      .map(this.extractData)
      .catch(this.handleError)
  }


  private extractData(res: Response) {
    console.log(res.json());
    let cityName = res.json().results[0].address_components[1].shortName;
    console.log("cityName:" + cityName);
    return {
      latitude: this.latitude,
      longitude: this.longitude,
      cityName: cityName
      } || {
        latitude: 13.4132,
        longitude: 52.5219,
        cityName: "Berlin"
      };
  }

  private handleError(error: Response | any) {
    //TODO: In a real world app, we might use a remote logging infrastructure
    let errMsg: string;
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
