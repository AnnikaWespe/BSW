import {Injectable} from "@angular/core";
import {Http, Headers} from "@angular/http";
import {EnvironmentService} from "../services/environment-service";

@Injectable()
export class FavoritesService {

  favoritesUrlSnippet: string;
  securityToken;
  mitgliedId;


  constructor(private http: Http, private envService: EnvironmentService) {
    this.favoritesUrlSnippet = this.envService.environment.BASE_URL + this.envService.environment.GET_FAVORITES;
    this.securityToken = encodeURIComponent(localStorage.getItem("securityToken"));
    this.mitgliedId = localStorage.getItem("mitgliedId");
  }

  createAuthorizationHeader(headers: Headers) {
    headers.append('Authorization', 'Basic ' +
      btoa('BSW_App:ev1boio32fSrjSY9XwvcD9LkGr13J'));
  }

  get(url) {
    let headers = new Headers({ 'Accept': 'application/json' });
    this.createAuthorizationHeader(headers);
    return this.http.get(url, {
      headers: headers
    });
  }

  getFavorites(id, token){
    token = encodeURIComponent(token);
    let url = this.favoritesUrlSnippet + 'get?mandant_id=1&mitglied_id=' + id + '&securityToken=' + token;
    console.log("getting favorites with url", url);
    return(this.get(url));
  }
  deleteFavorite(pfNumber){
    let url = this.favoritesUrlSnippet + 'loeschen.json?mandant_id=1&mitglied_id=' + this.mitgliedId + '&pfNummer=' + pfNumber +  '&securityToken=' + this.securityToken;
    return(this.get(url));
  }
  rememberFavorite(pfNumber){
    let url = this.favoritesUrlSnippet + 'merken.json?mandant_id=1&mitglied_id=' + this.mitgliedId + '&pfNummer=' + pfNumber + '&securityToken=' + this.securityToken;
    return(this.get(url));
  }
}



