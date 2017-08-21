import {Injectable} from "@angular/core";
import {Http, Headers, RequestOptions} from "@angular/http";
import { environment, urls } from '../../app/environment';

@Injectable()
export class LoginService {


  constructor(private http: Http) {
  }

  createAuthorizationHeader(headers: Headers) {
    headers.append('Authorization', 'Basic ' +
      btoa('BSW_App:ev1boio32fSrjSY9XwvcD9LkGr13J'));
  }

  login(username, password) {
    let loginUrl = environment.BASE_URL + urls.LOGIN;
    let headers = new Headers({'Content-Type': 'application/json'});
    this.createAuthorizationHeader(headers);
    let options = new RequestOptions({headers: headers});
    return this.http.post(loginUrl, {
      "mandantId": "1",
      "login": username,
      "password": password
    }, options);
  }

  forgotPassword(loginString) {
    let forgotPasswordUrl = environment.BASE_URL + urls.REQUEST_PASSWORD + '?mandant_id=1&login=';
    let securityToken = encodeURIComponent(localStorage.getItem("securityToken"));
    let headers = new Headers({'Accept': 'application/json'});
    this.createAuthorizationHeader(headers);
    let url = forgotPasswordUrl + loginString;
    return this.http.get(url, {
      headers: headers
    });
  }

}


