import {Injectable} from "@angular/core";
import {AuthService} from "./auth-service";
import {AlertController} from "ionic-angular";

declare let cordova: any;

@Injectable()
export class ExternalSiteService {

  constructor(public authService: AuthService, private alertCtrl: AlertController) {
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

    let inAppBrowserRef = openUrl(url, '_blank', 'location=no,closebuttoncaption=Zurück,toolbarposition=top');
    inAppBrowserRef.addEventListener('loaderror', (event)=>{this.loadErrorCallBack(event, inAppBrowserRef)});
    inAppBrowserRef.addEventListener('loadstart', (event)=>{this.loadStartCallBack(event, inAppBrowserRef)});

  }

  loadStartCallBack(event, inAppBrowserRef){
    //alert("start")
  }

  loadErrorCallBack(event, inAppBrowserRef) {

    inAppBrowserRef.close();

    let alert = this.alertCtrl.create({
      title: 'Fehler',
      message: 'Leider konnte die Seite nicht geladen werden.',
      buttons: [
        {
          text: 'OK',
          role: 'cancel',
          handler: () => {

          }
        }
      ]
    });
    alert.present();

  }

}
