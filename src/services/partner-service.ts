import {Injectable} from '@angular/core';
import {Http, Response, Headers, RequestOptions} from '@angular/http';

import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

import {GetPartnersPost} from './get-partners-Post';



@Injectable()
export class PartnerService {
  private partnersUrl = 'https://www.bsw.de/appsearch';

  constructor(private http: Http) {}

  getPartners(location, bucket, searchTerm): Observable <any> {
    let post = new GetPartnersPost(location, bucket, searchTerm);
    let headers = new Headers({'Content-Type': 'application/json'});
    let options = new RequestOptions({headers: headers});
    let getPartnersPostJson = JSON.stringify(post);
    console.log(getPartnersPostJson);

    return this.http.post(this.partnersUrl, getPartnersPostJson, options)
      .map(this.extractData)
      .catch(this.handleError)
  }


  private extractData(res: Response) {
    let body = res;
    console.log("partners:" + body);
    return body || {};
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