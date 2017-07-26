import {Component, ViewChild, OnDestroy} from '@angular/core';
import {NavController, NavParams} from "ionic-angular";
import {Http} from "@angular/http";
import {Observable} from "rxjs/Observable";
import {GoogleAnalytics} from "@ionic-native/google-analytics";
import {DeviceService} from "../../services/device-data";
import {DomSanitizer} from "@angular/platform-browser";
import {CachedContentService} from "./cached-content-data";

@Component({
  selector: 'webview',
  templateUrl: 'webview.html'
})
export class WebviewComponent implements OnDestroy {

  title: string;
  url;
  disallowUserTracking;
  dataProtectionScreen: boolean;
  noWebViewUrlsAvailable = false;
  cachedContent = "";
  @ViewChild('iframe') iframe;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public http: Http,
              private ga: GoogleAnalytics,
              private sanitizer: DomSanitizer) {
    this.noWebViewUrlsAvailable = (localStorage.getItem("noWebViewUrlsAvailable") === "true");
    this.title = navParams.get('title');
    let urlType = navParams.get('urlType');
    let urlRaw = localStorage.getItem(urlType);
    let mitgliedId = localStorage.getItem("mitgliedId");
    let securityToken = encodeURIComponent(localStorage.getItem("securityToken"));
    console.log(urlType);
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
      }
      else {
        this.cachedContent = CachedContentService[urlType];
      }
      this.http.get(this.url).subscribe((result) => {
        let entirePageHTML = result["_body"];
        let bodyHtml = /<body.*?>([\s\S]*)<\/body>/.exec(entirePageHTML)[1].replace(/<script[\s\S]*?<\/script>/, "");
        localStorage.setItem(urlType + "CachedContent", bodyHtml)
      }, (err) => {
      })
    }
    // this.url = sanitizer.bypassSecurityTrustHtml(this.url);
    console.log(this.url);
    this.dataProtectionScreen = (urlType === "DatenschutzWebviewUrl");
    this.disallowUserTracking = (localStorage.getItem("disallowUserTracking") == "true");
  }


  ngOnDestroy() {
    localStorage.setItem("disallowUserTracking", this.disallowUserTracking.toString());
    if (!this.disallowUserTracking) {
      if (DeviceService.isAndroid) {
        this.ga.startTrackerWithId("UA-64402282-2");
      }
      else if (DeviceService.isIos) {
        this.ga.startTrackerWithId("UA-64402282-1");
      }
    }
    else {

    }
  }

}
