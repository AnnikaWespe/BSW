import {Injectable} from "@angular/core";
import {Http, Headers} from "@angular/http";

@Injectable()
export class FavoritesService {

  favoritesUrlSnippet = 'https://vorsystem.avs.de/integ6/securityToken/favorit/';
  securityToken = encodeURIComponent(localStorage.getItem("securityToken"));
  mitgliedId = localStorage.getItem("mitgliedId");


  constructor(private http: Http) {
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

  getFavorites(){
    let url = this.favoritesUrlSnippet + 'get?mandant_id=1&mitglied_id=' + this.mitgliedId + '&securityToken=' + this.securityToken;
    return(this.get(url));
  }
  deleteFavorite(){}
  rememberFavorite(){
    let url = this.favoritesUrlSnippet + 'merken.json?mandant_id=1&mitglied_id=' + this.mitgliedId + '&pfNummer=11015201' + '&securityToken=' + this.securityToken;
    return(this.get(url));
  }


  /*post(url, data) {
   let headers = new Headers();
   this.createAuthorizationHeader(headers);
   return this.http.post(url, data, {
   headers: headers
   });
   }*/
}

