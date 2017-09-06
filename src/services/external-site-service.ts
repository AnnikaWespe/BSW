import {Injectable} from "@angular/core";
import {AuthService} from "./auth-service";
import {AlertController} from "ionic-angular";
import {InitService} from "../app/init-service";

declare let cordova: any;

@Injectable()
export class ExternalSiteService {

  constructor(public authService: AuthService, private alertCtrl: AlertController, private initService: InitService) {

  }

  gotToExternalSite(urlType, title) {
    let urlRaw = localStorage.getItem(urlType);
    let user = this.authService.getUser();
    let url;

    if(!urlRaw){
      this.loadWebViewUrls(urlType, title);
      return;
    }

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

    let inAppBrowserRef = openUrl(url, '_blank', 'location=no,closebuttoncaption='+title+',toolbarposition=top');

    if(inAppBrowserRef){
      inAppBrowserRef.addEventListener('loaderror', (event)=>{this.loadErrorCallBack(event, inAppBrowserRef)});
      inAppBrowserRef.addEventListener('loadstart', (event)=>{this.loadStartCallBack(event, inAppBrowserRef)});
    } else {
      this.showError();
    }


  }

  loadStartCallBack(event, inAppBrowserRef){
    //alert("start")
  }

  loadErrorCallBack(event, inAppBrowserRef) {

    inAppBrowserRef.close();
    this.showError();

  }

  showError(){

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

  loadWebViewUrls(urlType, title){

    this.initService.setWebViewUrls()
      .then(() => {

        this.gotToExternalSite(urlType, title)

      }, (error) => {

        console.error("cannot load webview urls");
        this.showError();

      });

  }

}
