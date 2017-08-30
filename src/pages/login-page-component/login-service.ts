import {Injectable} from "@angular/core";
import {Http, Headers, RequestOptions} from "@angular/http";
import {EnvironmentService} from "../../services/environment-service";

@Injectable()
export class LoginService {


  constructor(private http: Http, private envService: EnvironmentService) {
  }

  createAuthorizationHeader(headers: Headers) {
    headers.append('Authorization', this.envService.environment.AUTH_HEADER);
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
    }, options);
  }

  forgotPassword(loginString) {
    let forgotPasswordUrl = this.envService.environment.BASE_URL + this.envService.environment.REQUEST_PASSWORD + '?mandant_id=1&login=';
    let securityToken = encodeURIComponent(localStorage.getItem("securityToken"));
    let headers = new Headers({'Accept': 'application/json'});
    this.createAuthorizationHeader(headers);
    let url = forgotPasswordUrl + loginString;
    return this.http.get(url, {
      headers: headers
    });
  }

}


