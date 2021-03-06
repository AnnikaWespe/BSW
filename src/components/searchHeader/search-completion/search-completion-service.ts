import {Injectable} from '@angular/core';
import {Http, Response} from '@angular/http';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import {EnvironmentService} from "../../../services/environment-service";

@Injectable()
export class SearchCompletionService {
  constructor(private http: Http, private envService: EnvironmentService) {
  }

  getSuggestions(searchTerm, latitude = "0", longitude = "0"): Observable<any> {
    let rootOfUrl = this.envService.environment.BASE_URL_APP_SEARCH + this.envService.environment.AUTO_COMPLETION + "?prefix=";
    //let rootOfUrl = "http://localhost:8100/autocomplete/completephrasep?prefix=";
    let requestUrl: string = rootOfUrl + searchTerm + "&hal&radius=50&latitude=" + latitude + "&longitude=" + longitude + "&callback=www.bsw.de";
    console.log(requestUrl);
    return this.http.get(requestUrl)
      .map(this.extractData)
      .catch(this.handleError);
  }

  private extractData(res: Response) {
    console.log(res);
    let helperString = res.text().replace("www.bsw.de", "");
    let body = JSON.parse(helperString.substring(1, helperString.length - 1));
    console.log(body);


    /* removing all autocompletion results which have the URL property
     * these values are exclusively used by the bsw website
     * */
    if (body.results) {
      for (var i = body.results.length - 1; i >= 0; i--) {

        if (body.results[i].hasOwnProperty('url')) {
          body.results.splice(i, 1);
        }

      }
    }

    return body.results || [];
  }

  private handleError(error: Response | any) {
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
