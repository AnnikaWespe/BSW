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

  getBonusData() {
    console.log(this.mitgliedId, this.securityToken);
    let loginUrl = 'https://vorsystem.avs.de/integ6/securityToken/bonus/summen';
    let headers = new Headers({'Content-Type': 'application/json'});
    this.createAuthorizationHeader(headers);
    let options = new RequestOptions({headers: headers});
    return this.http.post(loginUrl, {
      "mandantId": "1",
      "fromDate": this.year + "-01-01",
      "toDate": this.year + "-12-31",
      "kontoauszugArtId": "73",
      "mitglied": {
        "mitgliedId": this.mitgliedId,
        "securityToken": this.securityToken
      }
    }, options);
  }
}
