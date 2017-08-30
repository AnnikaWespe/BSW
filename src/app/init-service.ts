import {Injectable} from "@angular/core";
import {Http, Headers, RequestOptions} from "@angular/http";
import {EnvironmentService} from "../services/environment-service";

@Injectable()
export class InitService {
  date = new Date();
  year = this.date.getFullYear();

  constructor(private http: Http, private envService: EnvironmentService) {}

  createAuthorizationHeader(headers: Headers) {
    headers.append('Authorization', this.envService.environment.AUTH_HEADER);
  }

  getWebViewUrlsFromApi() {
    let headers = new Headers({'Accept': 'application/json'});
    let url = this.envService.environment.BASE_URL + this.envService.environment.WEBVIEW_SERVICE + '?mandant_id=1'
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




