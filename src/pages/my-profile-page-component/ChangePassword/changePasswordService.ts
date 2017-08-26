import {Injectable} from "@angular/core";
import {Http, Headers, RequestOptions} from "@angular/http";
import {EnvironmentService} from "../../../services/environment-service";

@Injectable()
export class ChangePasswordService {

  mitgliedId = localStorage.getItem("mitgliedId");
  securityToken = encodeURI(localStorage.getItem("securityToken"));


  constructor(private http: Http, private envService: EnvironmentService) {
  }

  createAuthorizationHeader(headers: Headers) {
    headers.append('Authorization', this.envService.environment.AUTH_HEADER);
  }

  changePassword(oldPassword, newPassword) {
    console.log(this.mitgliedId, this.securityToken);
    let loginUrl = this.envService.environment.BASE_URL + this.envService.environment.CHANGE_PASSWORD;
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
