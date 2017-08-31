import {Injectable} from "@angular/core";
import {Http, Headers, RequestOptions} from "@angular/http";
import 'rxjs/add/operator/toPromise';

import {GoogleAnalytics} from "@ionic-native/google-analytics";

import {EnvironmentService} from "./environment-service";
import {Events} from "ionic-angular";

@Injectable()
export class AuthService {

  user: any = {};

  constructor(private http: Http,
              private envService: EnvironmentService,
              private ga: GoogleAnalytics,
              public events: Events) {
    this.user = JSON.parse(localStorage.getItem('user')) || {loggedIn: false};
  }

  createAuthorizationHeader(headers: Headers) {
    headers.append('Authorization', 'Basic ' +
      btoa('BSW_App:ev1boio32fSrjSY9XwvcD9LkGr13J'));
  }

  setUser(user: any) {
    this.user = user;
  }

  getUser() {
    return this.user;
  }

  login(username, password) {
    let loginUrl = this.envService.environment.BASE_URL + this.envService.environment.LOGIN;
    let headers = new Headers({'Content-Type': 'application/json'});
    this.createAuthorizationHeader(headers);
    let options = new RequestOptions({headers: headers});
    return this.http.post(loginUrl, {
      "mandantId": "1",
      "login": username,
      "password": password
    }, options)
    .toPromise()
    .then(
      (result) => {
        let loginData = result.json();
        if (loginData.errors[0].beschreibung === "Erfolg") {
          return {
            mitgliedsnummer: loginData.response.mitgliedsnummer + loginData.response.pruefziffer,
            securityToken: loginData.response.securityToken,
            mitgliedId: loginData.response.mitgliedId,
          }
        } else {
          throw 'LoginFailed';
        }
      },
      (error) => {
        throw 'NoNetwork';
      }
    )
    .then(
      (user) => {
        return this.getUserData(user.mitgliedId, user.securityToken).then(
          (userData) => {
            Object.assign(this.user, user, userData, {loggedIn: true});
            localStorage.setItem('user', JSON.stringify(this.user));
            console.log("Login: " + this.user)
            if (localStorage.getItem("disallowUserTracking") === "false") {
              this.ga.trackEvent('Login/Logout', 'login')
            }
            this.events.publish('user:loggedIn', this.user);
            return this.user;
          }
        )
      }
    );
  }

  logout() {
    this.user = {loggedIn: false};
    this.events.publish('user:loggedOut');
    localStorage.setItem('user', JSON.stringify(this.user));

    if (localStorage.getItem("disallowUserTracking") === "false") {
      this.ga.trackEvent('Login/Logout', 'logout');
    }
  }

  getUserData(mitgliedId, securityToken) {
    securityToken = encodeURIComponent(securityToken);
    let url = this.envService.environment.BASE_URL + this.envService.environment.MEMBER_DATA + '?mitglied_id=' + mitgliedId + '&mandant_id=1&securityToken=' + securityToken;
    let headers = new Headers({ 'Accept': 'application/json' });
    this.createAuthorizationHeader(headers);
    return this.http.get(url, {
      headers: headers
    })
    .toPromise()
    .then(
      (res) => {
        let result = res.json();
        if (result.errors[0].beschreibung === "Erfolg") {
          let data = result.response.list[0].row;
          return {
            lastName: data.NAME,
            salutation: data.ANREDE,
            title: data.TITEL || '',
            firstName: data.VORNAME
          }
        } else {
          console.log("in getUserData", result.errors[0].beschreibung);
          throw result.errors[0].beschreibung;
        }
      }
    );
  }

  forgotPassword(loginString) {
    let forgotPasswordUrl = this.envService.environment.BASE_URL + this.envService.environment.REQUEST_PASSWORD + '?mandant_id=1&login=';
    let securityToken = encodeURIComponent(this.user.securityToken);
    let headers = new Headers({'Accept': 'application/json'});
    this.createAuthorizationHeader(headers);
    let url = forgotPasswordUrl + loginString;
    return this.http.get(url, {
      headers: headers
    });
  }

  changePassword(oldPassword, newPassword) {
    console.log(this.user.mitgliedId, this.user.securityToken);
    let loginUrl = this.envService.environment.BASE_URL + this.envService.environment.CHANGE_PASSWORD;
    let headers = new Headers({'Content-Type': 'application/json'});
    this.createAuthorizationHeader(headers);
    let options = new RequestOptions({headers: headers});
    return this.http.post(loginUrl, {
      "mandantId": "1",
      "mitglied": {
        "mitgliedId": this.user.mitgliedId,
        "newPassword": newPassword,
        "password": oldPassword,
        "securityToken": this.user.securityToken,
      }
    }, options)
    .toPromise().then(
      (res) => {
        let response = res.json();
        if (response.errors[0].beschreibung === "Erfolg") {
          this.user.security.Token = response.response.securityToken;
          localStorage.setItem("user", JSON.stringify(this.user));
        } else {
          throw 'PasswordNotChanged';
        }
      },
      (error) => {
        throw 'PasswordNotChanged'
      }
    );
  }


}


