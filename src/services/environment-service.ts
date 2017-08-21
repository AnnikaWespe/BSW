import {Injectable} from '@angular/core';

declare const process: any; // Typescript compiler will complain without this

const environments = {

  test: {
    BASE_URL: "https://vorsystem.avs.de/integ6",
    BASE_URL_APP_SEARCH: "https://www.bsw.de",
  },
  prod: {
    BASE_URL: "https://vorsystem.avs.de/integ6",
    BASE_URL_APP_SEARCH: "https://www.bsw.de"
  },
  dev: {
    BASE_URL: "http://localhost:8100",
    BASE_URL_APP_SEARCH: "http://localhost:8100",
  },
  base: {
    WEBVIEW_SERVICE: "/cms/bswAppWebviewUrls",
    MEMBER_DATA: "/securityToken/getList/getMitgliedData",
    AUTO_COMPLETION: "/autocomplete/completephrasep",
    LOGIN: "/login",
    REQUEST_PASSWORD: "/passwortAnfordern",
    CHANGE_PASSWORD: "/securityToken/passwortAendern",
    BONUS_SUM: "/securityToken/bonus/summen",
    PARTNER_DETAIL: "/cms/partnerfirmaProfil/pfnummer",
    GET_FAVORITES: "/securityToken/favorit/",
    APP_SEARCH: "/appsearch",
    FIREBASE_SAVE_TOKEN: "/securityToken/saveFirebaseToken"
  }
};


@Injectable()
export class EnvironmentService {
  environment: any;
  constructor() {
    this.environment = {
      ...environments['base'],
      ...environments[process.env.IONIC_ENV],
      'ENV': process.env.IONIC_ENV
    };
  }
};
