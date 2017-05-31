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

  changePassword(oldPassword, newPassword) {
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
  }
}

// https://vorsystem.avs.de/integ6/securityToken/favorit/get?mandant_id=1&mitglied_id=
// 2586189&securityToken=AXy3QzusDoFQdPqX4xzQ4Oa6wNrEFKCN%2FpfQTfKcfxfnn0MMRkzLQlUzdT3IVC
// ej%2Fwzyc857rEsCX2EqFy7pU7yPNNcuFP9xOC5vyBXg0VyEcxXnYX2wVPHI3J9%2BDJIUYdXhPBva4Co92Eac9Ey8
// t0GT7RXeDxeC0%2BoDasz1YAaf2S22X%2FObPkp6cqrbpFV1o8RZTTwkBINoWyMuWJEWr%2FxWHpW7SAhH3VnJqrAy1S
// xqQEZhPUZTlroczTQIP461GKZq77VghkPcFqh5fUywr8ZT4wFdgqHYklNOEil5aWrUbTkB62eiQWmtrQyyJ8Xr4IbZqCbUGwN56S%2BCcagsaQ%3D%3D
