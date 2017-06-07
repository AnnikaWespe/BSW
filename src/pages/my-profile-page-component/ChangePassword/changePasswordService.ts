import {Injectable} from "@angular/core";
import {Http, Headers, RequestOptions} from "@angular/http";

@Injectable()
export class ChangePasswordService {

  mitgliedId = localStorage.getItem("mitgliedId");
  securityToken = encodeURIComponent(localStorage.getItem("securityToken"));


  constructor(private http: Http) {
  }

  createAuthorizationHeader(headers: Headers) {
    headers.append('Authorization', 'Basic ' +
      btoa('BSW_App:ev1boio32fSrjSY9XwvcD9LkGr13J'));
  }

  /*changePassword(oldPassword, newPassword) {
    console.log(this.mitgliedId, this.securityToken);
    let loginUrl = 'https://vorsystem.avs.de/integ6/securityToken/passwortAendern';
    let headers = new Headers({'Content-Type': 'application/json'});
    this.createAuthorizationHeader(headers);
    let options = new RequestOptions({headers: headers});
    return this.http.post(loginUrl, {
      "mandantId": "1",
      "mitglied": {
        "mitgliedId": this.mitgliedId,
        "newPassword": newPassword,
        "password": oldPassword,
        "securityToken": this.securityToken,
      }
    }, options);
  }*/

  changePassword(oldPassword, newPassword) {
    let changePasswordUrl = 'https://vorsystem.avs.de/integ6/securityToken/passwortAendern?mitglied_id=' + this.mitgliedId + '&password=' + oldPassword + '&mandant_id=1&new_password=' + newPassword +'&securityToken=' + this.securityToken;
    console.log(changePasswordUrl);
    let headers = new Headers({ 'Accept': 'application/json' });
    this.createAuthorizationHeader(headers);
    return this.http.get(changePasswordUrl, {
      headers: headers
    });
  }

}
