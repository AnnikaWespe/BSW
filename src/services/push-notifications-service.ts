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

  sendPushNotificationsRequest(newToken, oldToken) {

    let pushUrl = 'https://vorsystem.avs.de/integ6/securityToken/saveFirebaseToken';
    let headers = new Headers({ 'Content-Type': 'application/json' });

    this.createAuthorizationHeader(headers);
    let options = new RequestOptions({ headers: headers });
    let body = this.createBody(newToken, oldToken);
    console.log(body);
    return this.http.post(pushUrl, body, options);
  }

  createBody(newToken, oldToken){
    let securityToken = encodeURIComponent(localStorage.getItem("securityToken"));
    let favoritesPush = (localStorage.getItem("favoritesPush") == "false") || true;
    let accountInfoPush = (localStorage.getItem("accountInfoPush") == "false") || true;
    let enablePushesInGeneral = (localStorage.getItem("enablePushesInGeneral") == "false") || true;
    let mitgliedId = localStorage.getItem("mitgliedId");
    let body =  {
      "mandantId": "1",
      "mitglied": {
        "mitgliedId": mitgliedId,
        "firebaseToken": newToken,
        "oldFirebaseToken": oldToken,
        "firebasePermission":{
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

