import {Injectable} from "@angular/core";
import {Http, Headers, RequestOptions} from "@angular/http";
import { environment, urls } from '../../app/environment';
import {EnvironmentService} from "../../services/environment-service";
import {AuthService} from "../../services/auth-service";

@Injectable()
export class BonusService {
  date = new Date();
  year = this.date.getFullYear();

  constructor(private http: Http, private envService: EnvironmentService, public authService: AuthService,) {
  }

  createAuthorizationHeader(headers: Headers) {
    headers.append('Authorization', this.envService.environment.AUTH_HEADER);
  }

  getBonusData(id, securityToken) {
    securityToken = encodeURIComponent(securityToken);
    let headers = new Headers({'Accept': 'application/json'});
    let url = this.envService.environment.BASE_URL + this.envService.environment.BONUS_SUM + "?mandant_id=1&mitglied_id="
      + id + "&securityToken=" + securityToken + "&fromDate=" + this.year + "-01-01&toDate=" + this.year + "-12-31&kontoauszugsArtId=73";
    this.createAuthorizationHeader(headers);
    return this.http.get(url, {
      headers: headers
    });
  }


}
