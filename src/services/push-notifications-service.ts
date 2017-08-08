import {Injectable} from '@angular/core';
import {Http, Headers, RequestOptions} from "@angular/http";


@Injectable()
export class PushNotificationsService {

  constructor(private http: Http) {
  }

  createAuthorizationHeader(headers: Headers) {
    headers.append('Authorization', 'Basic ' +
      btoa('BSW_App:ev1boio32fSrjSY9XwvcD9LkGr13J'));
  }

  sendPushNotificationsRequest(mitgliedId, securityToken,newToken, oldToken) {

    let pushUrl = 'https://vorsystem.avs.de/integ6/securityToken/saveFirebaseToken';
    let headers = new Headers({'Content-Type': 'application/json'});

    this.createAuthorizationHeader(headers);
    let options = new RequestOptions({headers: headers});
    let body = this.createBody(mitgliedId, securityToken,newToken, oldToken);
    console.log(JSON.stringify(body));
    return this.http.post(pushUrl, body, options);
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

    let pushUrl = 'https://vorsystem.avs.de/integ6/securityToken/saveFirebaseToken';
    let headers = new Headers({'Content-Type': 'application/json'});

    this.createAuthorizationHeader(headers);
    let options = new RequestOptions({headers: headers});
    let body = this.createBodyNewSettings(favoritesPush, accountInfoPush, enablePushesInGeneral);
    console.log(JSON.stringify(body));
    return this.http.post(pushUrl, body, options);
  }

  private createBodyNewSettings(favoritesPush, accountInfoPush, enablePushesInGeneral) {
    let securityToken = encodeURI(localStorage.getItem("securityToken"));
    let mitgliedId = localStorage.getItem("mitgliedId");
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

