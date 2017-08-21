import {Injectable} from "@angular/core";
import {Http, Headers} from "@angular/http";
import { environment, urls } from '../../../../app/environment';

@Injectable()
export class PartnerDetailService {

  partnerDetailUrl = environment.BASE_URL + urls.PARTNER_DETAIL + '?mandant_id=1&pfNummer=';


  constructor(private http: Http) {
  }

  createAuthorizationHeader(headers: Headers) {
    headers.append('Authorization', 'Basic ' +
      btoa('BSW_App:ev1boio32fSrjSY9XwvcD9LkGr13J'));
  }

  getDetails(pfNummer) {
    let url = this.partnerDetailUrl + pfNummer;
    let headers = new Headers({ 'Accept': 'application/json' });
    this.createAuthorizationHeader(headers);
    console.log(url, headers);
    return this.http.get(url, {
      headers: headers
    });
  }

}
