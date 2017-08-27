import {Injectable} from "@angular/core";
import {Http, Headers} from "@angular/http";
import {EnvironmentService} from "../services/environment-service";
import {AuthService} from "./auth-service";

@Injectable()
export class FavoritesService {
  favoritesUrlSnippet: string;

  constructor(private http: Http, private envService: EnvironmentService, public authService: AuthService,) {
    this.favoritesUrlSnippet = this.envService.environment.BASE_URL + this.envService.environment.GET_FAVORITES;
  }

  private createAuthorizationHeader(headers: Headers) {
    headers.append('Authorization', this.envService.environment.AUTH_HEADER);
  }

  private get(url) {
    let headers = new Headers({ 'Accept': 'application/json' });
    this.createAuthorizationHeader(headers);
    return this.http.get(url, {
      headers: headers
    });
  }

  getFavorites(id, securityToken){
    securityToken = encodeURIComponent(securityToken);
    let url = this.favoritesUrlSnippet + 'get?mandant_id=1&mitglied_id=' + id + '&securityToken=' + securityToken;
    return(this.get(url));
  }

  deleteFavorite(pfNumber){
    let securityToken = encodeURIComponent(this.authService.getUser().securityToken)
    let url = this.favoritesUrlSnippet + 'loeschen.json?mandant_id=1&mitglied_id=' + this.authService.getUser().mitgliedId + '&pfNummer=' + pfNumber +  '&securityToken=' + securityToken;
    return(this.get(url));
  }

  rememberFavorite(pfNumber){
    let securityToken = encodeURIComponent(this.authService.getUser().securityToken)
    let url = this.favoritesUrlSnippet + 'merken.json?mandant_id=1&mitglied_id=' + this.authService.getUser().mitgliedId + '&pfNummer=' + pfNumber + '&securityToken=' + securityToken;
    return(this.get(url));
  }
}



