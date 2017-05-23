import {Component, ViewChild, OnDestroy} from '@angular/core';
import {NavController, NavParams} from "ionic-angular";
import {Http} from "@angular/http";
import {Observable} from "rxjs/Observable";

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
              public http: Http) {
    //this.url = navParams.get('url');
    this.url = "https://www.bsw.de/ueber-bsw/impressum.htm"
    this.title = navParams.get('title');
    this.cacheContent = navParams.get('cacheContent');
    this.dataProtectionScreen = navParams.get('dataProtectionScreen') || false;
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
  }

}


