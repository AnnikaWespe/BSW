import {Injectable} from '@angular/core';
import {Http, Headers, RequestOptions} from "@angular/http";
import {EnvironmentService} from "./environment-service";
import {AuthService} from "./auth-service";

@Injectable()
export class PushNotificationsService {

  constructor(private http: Http, private envService: EnvironmentService, public authService: AuthService,) {
  }

  createAuthorizationHeader(headers: Headers) {
    headers.append('Authorization', this.envService.environment.AUTH_HEADER);
  }

  sendPushNotificationsRequest(mitgliedId, securityToken,newToken, oldToken) {

    /* note: on first start, all settings should be disabled by default */

    /*
     * disabled until firebase and pushes getting reimplemented
     *
    let pushUrl = environment.BASE_URL + urls.SAVE_FIREBASE_TOKEN;
    let headers = new Headers({'Content-Type': 'application/json'});

    this.createAuthorizationHeader(headers);
    let options = new RequestOptions({headers: headers});
    let body = this.createBody(mitgliedId, securityToken,newToken, oldToken);
    console.log(JSON.stringify(body));
    return this.http.post(pushUrl, body, options);
    */

  }

  private createBody(mitgliedId, securityToken,newToken, oldToken) {
    securityToken = encodeURI(securityToken);
    let favoritesPush = (localStorage.getItem("favoritesPush") == "false") ? false : true;
    let accountInfoPush = (localStorage.getItem("accountInfoPush") == "false") ? false : true;
    let enablePushesInGeneral = (localStorage.getItem("enablePushesInGeneral") == "false") ? false : true;
    let body = {
      "mandantId": "1",
      "mitglied": {
        "mitgliedId": mitgliedId,
        "firebaseToken": newToken,
        "oldFirebaseToken": oldToken,
        "firebasePermission": {
          "PUSH_GENERELL": enablePushesInGeneral,
          "PUSH_BONUSWERT": accountInfoPush,
          "PUSH_FAVORITEN_AKTION_START": favoritesPush
        },
        "securityToken": securityToken
      }
    }
    return body;
  }

  sendPushNotificationsRequestWithNewSettings(favoritesPush, accountInfoPush, enablePushesInGeneral) {

    /*
     * disabled until firebase and pushes getting reimplemented
     *
    let pushUrl = environment.BASE_URL + urls.SAVE_FIREBASE_TOKEN;
    let headers = new Headers({'Content-Type': 'application/json'});

    this.createAuthorizationHeader(headers);
    let options = new RequestOptions({headers: headers});
    let body = this.createBodyNewSettings(favoritesPush, accountInfoPush, enablePushesInGeneral);
    console.log(JSON.stringify(body));
    return this.http.post(pushUrl, body, options);
    */

  }

  private createBodyNewSettings(favoritesPush, accountInfoPush, enablePushesInGeneral) {
    let securityToken = this.authService.getUser().securityToken;
    let mitgliedId = this.authService.getUser().mitgliedId;
    let token = localStorage.getItem("firebaseToken");
    let body = {
      "mandantId": "1",
      "mitglied": {
        "mitgliedId": mitgliedId,
        "firebaseToken": token,
        "oldFirebaseToken": token,
        "firebasePermission": {
          "PUSH_GENERELL": enablePushesInGeneral,
          "PUSH_BONUSWERT": accountInfoPush,
          "PUSH_FAVORITEN_AKTION_START": favoritesPush
        },
        "securityToken": securityToken
      }
    }
    return body;
  }

}

