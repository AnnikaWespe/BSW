import {Injectable} from "@angular/core";
import {Http, Headers, RequestOptions} from "@angular/http";
import { environment, urls } from './environment';

@Injectable()
export class InitService {

  //mitgliedId = localStorage.getItem("mitgliedId");
  //securityToken = encodeURIComponent(localStorage.getItem("securityToken"));
  date = new Date();
  year = this.date.getFullYear();


  constructor(private http: Http) {

  }

  createAuthorizationHeader(headers: Headers) {
    headers.append('Authorization', 'Basic ' +
      btoa('BSW_App:ev1boio32fSrjSY9XwvcD9LkGr13J'));
  }

  getWebViewUrlsFromApi() {
    let headers = new Headers({'Accept': 'application/json'});
    let url = environment.BASE_URL + urls.WEBVIEW_SERVICE + '?mandant_id=1'
    this.createAuthorizationHeader(headers);
    return this.http.get(url, {
      headers: headers
    });
  }

  getUserData(mitgliedId, securityToken) {
    securityToken = encodeURIComponent(securityToken);
    let url = environment.BASE_URL + urls.MEMBER_DATA + '?mitglied_id=' + mitgliedId + '&mandant_id=1&securityToken=' + securityToken;
    let headers = new Headers({ 'Accept': 'application/json' });
    this.createAuthorizationHeader(headers);
    return this.http.get(url, {
      headers: headers
    });
  }

  setWebViewUrls(){
    this.getWebViewUrlsFromApi().subscribe((res) => {
      let result = res.json();
      if (result.errors[0].beschreibung === "Erfolg") {
        console.log(result.response);
        let resultArray = result.response.bswAppWebviewUrl;
        for (let item of resultArray){
          localStorage.setItem(item.viewname + "WebviewUrl", item.webviewUrl)
        }
      }
      else {
        localStorage.setItem("noWebViewUrlsAvailable", "true");
      }
    });
  }

}




