import {AfterViewInit, Component, ElementRef, OnDestroy, QueryList, ViewChild, ViewChildren} from '@angular/core';
import {NavController, NavParams, LoadingController, AlertController, Nav} from "ionic-angular";
import {Http} from "@angular/http";
import {GoogleAnalytics} from "@ionic-native/google-analytics";
import {DeviceService} from "../../services/device-data";
import {DomSanitizer} from "@angular/platform-browser";
import {CachedContentService} from "./cached-content-data";

declare let cordova: any;


@Component({
  selector: 'webview',
  templateUrl: 'webview.html'
})
export class WebviewComponent implements OnDestroy, AfterViewInit {

  title: string;
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

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public http: Http,
              private ga: GoogleAnalytics,
              private elementRef: ElementRef,
              private alertCtrl: AlertController,
              public loadingCtrl: LoadingController) {
    console.error(localStorage.getItem("noWebViewUrlsAvailable"));
    this.noWebViewUrlsAvailable = (localStorage.getItem("noWebViewUrlsAvailable") === "true");
    this.title = navParams.get('title');
    let urlType = navParams.get('urlType');
    let urlRaw = localStorage.getItem(urlType);
    console.log(urlRaw);


    /* No urls available */
    if (!urlRaw) {

      /* show cached content, if it is impressum or datanschutz */
      if (urlType === "ImpressumWebviewUrl" || urlType === "DatenschutzWebviewUrl") {

        let content = localStorage.getItem(urlType + "CachedContent");
        if (content) {
          this.cachedContent = content;
        } else {

          /* no content cached yet, store it and load it */
          content = CachedContentService[urlType];
          localStorage.setItem(urlType + "CachedContent", content);
          this.cachedContent = content;

        }
        return;

      } else {

        this.url = "about:blank";
        this.errorLoad();
        return;

      }

    }


    let mitgliedId = localStorage.getItem("mitgliedId");
    let securityToken = localStorage.getItem("securityToken");
    console.log(urlType);


    this.showLoadingIndicator();

    if (securityToken) {
      this.url = urlRaw.replace("[MITGLIEDID]", mitgliedId).replace("[SECURITYTOKEN]", securityToken);
    }
    else {
      this.url = urlRaw.replace("/[MITGLIEDID]", "").replace("/[SECURITYTOKEN]", "");
    }

    if (urlType === "ImpressumWebviewUrl" || urlType === "DatenschutzWebviewUrl") {

      let content = localStorage.getItem(urlType + "CachedContent");
      if (content) {
        this.cachedContent = content;
        this.dismissLoadingIndicator();
      }
      else {
        this.cachedContent = CachedContentService[urlType];
        this.dismissLoadingIndicator();
      }

      this.http.get(this.url).subscribe((result) => {
        let entirePageHTML = result["_body"];
        let bodyHtml = /<body.*?>([\s\S]*)<\/body>/.exec(entirePageHTML)[1].replace(/<script[\s\S]*?<\/script>/g, "");
        localStorage.setItem(urlType + "CachedContent", bodyHtml)
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
    this.dataProtectionScreen = (urlType === "DatenschutzWebviewUrl");
    this.disallowUserTracking = (localStorage.getItem("disallowUserTracking") == "true");
    this.allowUserTracking = !this.disallowUserTracking;

  }

  ngAfterViewInit() {

    if (this.iframe) {

      this.timeoutHandle = setTimeout(this.errorLoad, 10000);
      this.iframe.nativeElement.onload = () => {
        clearTimeout(this.timeoutHandle);
        this.dismissLoadingIndicator();
      }

    }

  }

  ngOnDestroy() {
    this.disallowUserTracking = !this.allowUserTracking;
    localStorage.setItem("disallowUserTracking", this.disallowUserTracking.toString());
    if (!this.disallowUserTracking) {
      if (DeviceService.isAndroid) {
        this.ga.startTrackerWithId("UA-64402282-2");
      }
      else if (DeviceService.isIos) {
        this.ga.startTrackerWithId("UA-64402282-1");
      }
    }
    this.dismissLoadingIndicator();
  }

  errorLoad() {

    if (this.alert) {
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

}
