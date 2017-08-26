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
    this.loadAuthData();
  }

  private static createAuthorizationHeader(headers: Headers) {
    headers.append('Authorization', 'Basic ' +
      btoa('BSW_App:ev1boio32fSrjSY9XwvcD9LkGr13J'));
  }

  private get(url) {
    let headers = new Headers({ 'Accept': 'application/json' });
    FavoritesService.createAuthorizationHeader(headers);
    return this.http.get(url, {
      headers: headers
    });
  }

  getFavorites(id, token){

    this.loadAuthData();
    let url = this.favoritesUrlSnippet + 'get?mandant_id=1&mitglied_id=' + id + '&securityToken=' + encodeURIComponent(token);
    return(this.get(url));

  }

  deleteFavorite(pfNumber){

    this.loadAuthData();
    let url = this.favoritesUrlSnippet + 'loeschen.json?mandant_id=1&mitglied_id=' + this.mitgliedId + '&pfNummer=' + pfNumber +  '&securityToken=' + this.securityToken;
    return(this.get(url));

  }

  rememberFavorite(pfNumber){

    this.loadAuthData();
    let url = this.favoritesUrlSnippet + 'merken.json?mandant_id=1&mitglied_id=' + this.mitgliedId + '&pfNummer=' + pfNumber + '&securityToken=' + this.securityToken;
    return(this.get(url));

  }

  /*
   *
   * function which allows to load auth data before every call
   * auth data should be managed in a service
   *
   *  */
  private loadAuthData(){

    this.securityToken = encodeURIComponent(localStorage.getItem("securityToken"));
    this.mitgliedId = localStorage.getItem("mitgliedId");

  }

}



