import {Injectable} from '@angular/core';
import {Http, Response} from '@angular/http';
import {Geolocation} from 'ionic-native';

import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import {LocationData} from "./location-data";
import {BehaviorSubject, Subject} from "rxjs";



@Injectable()
export class LocationService {
  private getLocationNameUrl = 'http://maps.googleapis.com/maps/api/geocode/json?latlng=';
  private latitude;
  private longitude;
  constructor(private http: Http) {}

  private locationSource = new Subject<any>();
  locationFound = this.locationSource.asObservable();


  getLocation(){
    Geolocation.getCurrentPosition().then((position) => {
      let latitude = position.coords.latitude.toFixed(4);
      let longitude = position.coords.longitude.toFixed(4);
      LocationData.latitude = latitude;
      LocationData.longitude = longitude;
      LocationData.locationExact = true;
      LocationData.locationAvailable = true;
      this.giveBackLocation({lat: latitude, lon: longitude, locationFound: true});
    }, (err) => {
      this.giveBackLocation({lat: "0", lon: "0", locationFound: false});
    })
  }

  getLocationName(lat, lon): Observable <any> {
    let url = this.getLocationNameUrl + lat + "," + lon + '&sensor=true';
    console.log(url);
    return this.http.get(url)
      .map(this.extractData)
      .catch(this.handleError);
  }

  private giveBackLocation(object){
    this.locationSource.next(object)
  }


  private extractData(res: Response) {
    let cityName = res.json().results[0].address_components[2].long_name;
    LocationData.cityName = cityName;
    return cityName;
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
