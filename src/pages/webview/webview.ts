import {Component, ViewChild, OnDestroy} from '@angular/core';
import {NavController, NavParams} from "ionic-angular";
import {Http} from "@angular/http";
import {Observable} from "rxjs/Observable";
import {GoogleAnalytics} from "@ionic-native/google-analytics";

@Component({
  selector: 'webview',
  templateUrl: 'webview.html'
})
export class WebviewComponent implements OnDestroy {

  title: string;
  url;
  disallowUserTracking = false;
  cacheContent: boolean;
  dataProtectionScreen: boolean;
  @ViewChild('iframe') iframe;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public http: Http,
              private ga: GoogleAnalytics) {
    console.log(localStorage.getItem("securityToken"));
    console.log(localStorage.getItem("mitgliedId"));
    let urlType = navParams.get('urlType');
    let urlRaw = localStorage.getItem(urlType);
    let mitgliedId = localStorage.getItem("mitgliedId");
    let securityToken = localStorage.getItem("securityToken");
    if (!securityToken || urlType === "ImpressumWebviewUrl" || urlType === "DatenschutzWebviewUrl") {
      this.url = urlRaw.replace("/[MITGLIEDID]", "").replace("/[SECURITYTOKEN]", "");
    }
    else {
      this.url = urlRaw.replace("[MITGLIEDID]", mitgliedId).replace("[SECURITYTOKEN]", securityToken);
    }
    console.log(this.url);
    this.title = navParams.get('title');
    this.cacheContent = navParams.get('cacheContent');
    this.dataProtectionScreen = (urlType ==="DatenschutzWebviewUrl");
    this.disallowUserTracking = (localStorage.getItem("disallowUserTracking") == "true");

    if (this.cacheContent) {
      this.saveContentOrDisplay().subscribe((res) => {
        console.log(res);
      })
    }
  }

// methods for webviews "data security" and "imprint"
  saveContentOrDisplay(): Observable<any> {
    return this.http.get(this.url)
      .map(this.extractData)
      .catch(this.handleError);
  }

  private handleError(error) {
    console.log(error);
    let errMsg = error.message ? error.message : error.toString();
    return Observable.throw(errMsg);
  }

  private extractData(res) {
    return res;
  }

  ngOnDestroy() {
    localStorage.setItem("disallowUserTracking", this.disallowUserTracking.toString());
    if (!this.disallowUserTracking) {
      this.ga.startTrackerWithId('UA-99848389-1');
    }
  }

}
