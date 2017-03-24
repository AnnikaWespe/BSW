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


  getLocation() {
    Geolocation.getCurrentPosition().then((position) => {
      this.latitude = position.coords.latitude.toFixed(4);
      this.longitude = position.coords.longitude.toFixed(4);
      LocationData.latitude = this.latitude;
      LocationData.longitude = this.longitude;
      LocationData.locationExact = true;
      LocationData.locationAvailable = true;
      return this.getLocationName(this.latitude, this.longitude);
    }, (err) => {
      console.log(err);
    })
  }

  getLocationName(lat, lon): Observable <any> {
    let url = this.getLocationNameUrl + lat + "," + lon + '&sensor=true';
    return this.http.get(url)
      .map(this.extractData)
      .catch(this.handleError);
  }


  private extractData(res: Response) {
    let cityName = res.json().results[0].address_components[0].short_name;
    LocationData.cityName = cityName;
    return {};
  }

  private handleError(error: Response | any) {
    //TODO: In a real world app, we might use a remote logging infrastructure
    let errMsg: string;
    console.log("error");
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
