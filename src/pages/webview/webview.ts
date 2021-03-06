import {AfterViewInit, Component, ElementRef, OnDestroy, QueryList, ViewChild, ViewChildren} from '@angular/core';
import {NavController, NavParams, LoadingController, AlertController, Nav} from "ionic-angular";
import {Http} from "@angular/http";
import {GoogleAnalytics} from "@ionic-native/google-analytics";
import {DeviceService} from "../../services/device-data";
import {DomSanitizer} from "@angular/platform-browser";
import {CachedContentService} from "./cached-content-data";
import {AuthService} from "../../services/auth-service";
import { Keyboard } from '@ionic-native/keyboard';
import {InitService} from "../../app/init-service";

declare let cordova: any;


@Component({
  selector: 'webview',
  templateUrl: 'webview.html'
})
export class WebviewComponent implements OnDestroy, AfterViewInit {


  url;
  disallowUserTracking;
  allowUserTracking;
  dataProtectionScreen: boolean;
  noWebViewUrlsAvailable = false;
  cachedContent = "";

  /* loading properties */
  isLoading;
  timeoutHandle: any;
  alert: any;

  @ViewChild('iframe') iframe: ElementRef;

  urlType: any;
  title: string;
  urlLoading = false;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public http: Http,
              private ga: GoogleAnalytics,
              private elementRef: ElementRef,
              private alertCtrl: AlertController,
              public authService: AuthService,
              public loadingCtrl: LoadingController,
              private keyboard: Keyboard,
              private initService: InitService) {

      this.title = navParams.get('title');
      this.urlType = navParams.get('urlType');

      if (!localStorage.getItem(this.urlType)) {
        this.loadWebViewUrls();
      }

      this.loadWebPage();

  }

  loadWebPage(){

    console.error(localStorage.getItem("noWebViewUrlsAvailable"));
    this.noWebViewUrlsAvailable = (localStorage.getItem("noWebViewUrlsAvailable") === "true");

    let urlRaw = localStorage.getItem(this.urlType);
    console.log(urlRaw);

    this.dataProtectionScreen = (this.urlType === "DatenschutzWebviewUrl");
    this.disallowUserTracking = (localStorage.getItem("disallowUserTracking") == "true");
    this.allowUserTracking = !this.disallowUserTracking;

    /* No urls available */
    if (!urlRaw) {

      /* show cached content, if it is impressum or datanschutz */
      if (this.urlType === "ImpressumWebviewUrl" || this.urlType === "DatenschutzWebviewUrl") {

        let content = localStorage.getItem(this.urlType + "CachedContent");
        if (content) {
          this.cachedContent = content;
        } else {

          /* no content cached yet, store it and load it */
          content = CachedContentService[this.urlType];
          localStorage.setItem(this.urlType + "CachedContent", content);
          this.cachedContent = content;

        }
        return;

      } else {

        this.url = "about:blank";
        this.errorLoad();
        return;

      }

    }

    this.showLoadingIndicator();
    let user = this.authService.getUser();
    if (user.loggedIn) {
      // TODO JS: macht das sinn?
      this.url = urlRaw.replace("[MITGLIEDID]", user.mitgliedId).replace("[SECURITYTOKEN]", user.securityToken);
    }
    else {
      this.url = urlRaw.replace("/[MITGLIEDID]", "").replace("/[SECURITYTOKEN]", "");
    }

    if (this.urlType === "ImpressumWebviewUrl" || this.urlType === "DatenschutzWebviewUrl") {

      let content = localStorage.getItem(this.urlType + "CachedContent");
      if (content) {
        this.cachedContent = content;
        this.dismissLoadingIndicator();
      }
      else {
        this.cachedContent = CachedContentService[this.urlType];
        this.dismissLoadingIndicator();
      }

      this.http.get(this.url).subscribe((result) => {
        let entirePageHTML = result["_body"];
        let bodyHtml = /<body.*?>([\s\S]*)<\/body>/.exec(entirePageHTML)[1].replace(/<script[\s\S]*?<\/script>/g, "");
        localStorage.setItem(this.urlType + "CachedContent", bodyHtml)
        this.cachedContent = bodyHtml;
        this.dismissLoadingIndicator();
      }, (err) => {
        this.dismissLoadingIndicator();
      })

    } else {

      /* try to get page which will be loaded in iframe */
      this.http.get(this.url).subscribe((result) => {

        /* everything is cool */

      }, (err) => {

        /* if we get an error here, show error message and hide iframe */
        this.errorLoad();
        this.cachedContent = "<html><head></head><body></body></html>";

      });

    }

  console.log(this.url);

  }

  ionViewDidEnter(){
    this.keyboard.disableScroll(true)
  }

  ionViewDidLeave(){

    this.url = "about:blank";
    this.cachedContent = null;
    this.keyboard.close();

    if(this.timeoutHandle) {
      clearTimeout(this.timeoutHandle);
    }

  }

  ngAfterViewInit() {

    if (this.iframe) {

      this.timeoutHandle = setTimeout(() => {this.errorLoad()}, 15000);
      this.iframe.nativeElement.onload = () => {
        clearTimeout(this.timeoutHandle);
        this.dismissLoadingIndicator();
      }

      this.iframe.nativeElement.onerror = (error) => {
        console.error("iframe: " + error);
      };

    }

  }

  ngOnDestroy() {

    if(this.dataProtectionScreen){
      this.disallowUserTracking = !this.allowUserTracking;

      localStorage.setItem("disallowUserTracking", this.disallowUserTracking.toString());
      if (!this.disallowUserTracking) {

        this.ga.setOptOut(false);
        if (DeviceService.isAndroid) {
          this.ga.startTrackerWithId("UA-64402282-2");
        }
        else if (DeviceService.isIos) {
          this.ga.startTrackerWithId("UA-64402282-1");
        }

      } else {
        this.ga.setOptOut(true);
      }

    }

    this.dismissLoadingIndicator();

  }

  errorLoad() {

    if (this.alert || this.urlLoading) {
      return;
    }

    this.dismissLoadingIndicator();
    this.alert = this.alertCtrl.create({
      title: 'Fehler',
      message: 'Leider konnte die Seite nicht geladen werden.',
      buttons: [
        {
          text: 'OK',
          role: 'cancel',
          handler: () => {
            this.navCtrl.pop();
          }
        }
      ]
    });
    this.alert.present();

  }

  showLoadingIndicator() {
    this.isLoading = true;
  }

  dismissLoadingIndicator() {
    this.isLoading = false;
  }

  loadWebViewUrls(){

    this.urlLoading = true;

    this.initService.setWebViewUrls()
      .then(() => {

        this.urlLoading = false;
        this.loadWebPage();

      }, (error) => {

        console.error("cannot load webview urls");
        this.urlLoading = false;
        this.loadWebPage();

      });

  }


}
