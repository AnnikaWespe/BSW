import {Injectable} from "@angular/core";
import {Http, Headers, RequestOptions} from "@angular/http";

@Injectable()
export class InitService {

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

  getWebViewUrls() {
    let headers = new Headers({'Accept': 'application/json'});
    let url = 'https://vorsystem.avs.de/integ6/cms/bswAppWebviewUrls?mandant_id=1'
    this.createAuthorizationHeader(headers);
    return this.http.get(url, {
      headers: headers
    });
  }

  getUserData() {
    let url = 'https://vorsystem.avs.de/integ6/securityToken/getList/getMitgliedData?mitglied_id=' + this.mitgliedId + '&mandant_id=1&securityToken=' + this.securityToken;
    let headers = new Headers({ 'Accept': 'application/json' });
    this.createAuthorizationHeader(headers);
    return this.http.get(url, {
      headers: headers
    });
  }
}
