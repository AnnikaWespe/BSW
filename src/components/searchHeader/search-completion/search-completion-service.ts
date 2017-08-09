
import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

@Injectable()
export class SearchCompletionService {
  constructor (private http: Http) {}

  getSuggestions (searchTerm, latitude = "0", longitude = "0"): Observable<any> {
    //let rootOfUrl = "https://www.bsw.de/autocomplete/completephrasep?prefix=";
    let rootOfUrl = "http://localhost:8100/autocomplete/completephrasep?prefix=";
    let requestUrl : string = rootOfUrl + searchTerm + "&hal&radius=50&latitude=" + latitude + "&longitude=" + longitude + "&callback=www.bsw.de";
    console.log(requestUrl);
    return this.http.get(requestUrl)
      .map(this.extractData)
      .catch(this.handleError);
  }

  private extractData(res: Response) {
    console.log(res);
    let helperString = res.text().replace("www.bsw.de", "");
    let body = JSON.parse(helperString.substring(1, helperString.length-1));
    console.log(body);
    return body.results || [];
  }
  private handleError (error: Response | any) {
    // TODO: In a real world app, we might use a remote logging infrastructure
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
