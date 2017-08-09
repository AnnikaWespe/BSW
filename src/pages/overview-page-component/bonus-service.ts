import {Injectable} from "@angular/core";
import {Http, Headers, RequestOptions} from "@angular/http";

@Injectable()
export class BonusService {

  mitgliedId = localStorage.getItem("mitgliedId");
  securityToken = encodeURIComponent(localStorage.getItem("securityToken"));
  date = new Date();
  year = this.date.getFullYear();


  constructor(private http: Http) {
  }

  createAuthorizationHeader(headers: Headers) {
    headers.append('Authorization', 'Basic ' +
      btoa('BSW_App:ev1boio32fSrjSY9XwvcD9LkGr13J'));
  }

  getBonusData(id, token) {
    token = encodeURIComponent(token);
    let headers = new Headers({'Accept': 'application/json'});
    //let url = "https://vorsystem.avs.de/integ6/securityToken/bonus/summen?mandant_id=1&mitglied_id="
    //  + id + "&securityToken=" + token + "&fromDate=" + this.year + "-01-01&toDate=" + this.year + "-12-31&kontoauszugsArtId=73";

    let url = "http://localhost:8100/securityToken/bonus/summen?mandant_id=1&mitglied_id="
      + id + "&securityToken=" + token + "&fromDate=" + this.year + "-01-01&toDate=" + this.year + "-12-31&kontoauszugsArtId=73";

    this.createAuthorizationHeader(headers);
    return this.http.get(url, {
      headers: headers
    });
  }


}
