import {Injectable} from "@angular/core";
import {Http, Headers} from "@angular/http";
import {EnvironmentService} from "../../../../services/environment-service";

@Injectable()
export class PartnerDetailService {

  partnerDetailUrl: string;
  //partnerDetailUrl = 'http://localhost:8100/cms/partnerfirmaProfil/pfnummer?mandant_id=1&pfNummer=';

  constructor(private http: Http, private envService: EnvironmentService) {
    this.partnerDetailUrl = this.envService.environment.BASE_URL + this.envService.environment.PARTNER_DETAIL + '?mandant_id=1&pfNummer=';
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
