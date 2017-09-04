import {Injectable} from "@angular/core";
import {AuthService} from "./auth-service";
declare let cordova: any;

@Injectable()
export class ExternalSiteService {

  constructor(public authService: AuthService) {
  }


  gotToExternalSite(urlType) {
    let urlRaw = localStorage.getItem(urlType);
    let user = this.authService.getUser();
    let url;
    if (user.loggedIn) {
      url = urlRaw.replace("[MITGLIEDID]", user.mitgliedId).replace("[SECURITYTOKEN]", user.securityToken);
    }
    else {
      url = urlRaw.replace("/[MITGLIEDID]", "").replace("/[SECURITYTOKEN]", "");
    }
    let openUrl: any;
    try {
      openUrl = cordova.InAppBrowser.open;
    } catch (error) {
      openUrl = open;
    }
    console.log(url);
    openUrl(url, '_blank', 'location=no');
  }
}
