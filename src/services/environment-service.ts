import {Injectable} from '@angular/core';

declare const process: any; // Typescript compiler will complain without this

const environments = {

  test: {
    BASE_URL: "https://vorsystem.avs.de/integ6",
    BASE_URL_APP_SEARCH: "https://www.bsw.de",
    AUTH_HEADER: 'Basic ' + btoa('BSW_App:ev1boio32fSrjSY9XwvcD9LkGr13J')
  },
  prod: {
    BASE_URL: "https://vorsystem.avs.de/prod",
    BASE_URL_APP_SEARCH: "https://www.bsw.de",
    AUTH_HEADER: 'Basic ' + btoa('BSW_App:Dk8ejHf4vJrL2zuOkl89isvDf5gAifgDtH')
  },
  dev: {
    BASE_URL: "/proxy/integ6",
    BASE_URL_APP_SEARCH: "/proxy",
    AUTH_HEADER: 'Basic ' + btoa('BSW_App:ev1boio32fSrjSY9XwvcD9LkGr13J')
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
    console.log('Your are running in project environment ' + process.env.ENV);
    console.log('Your are running in ionic environment ' + process.env.IONIC_ENV);
    this.environment = {
      ...environments['base'],
      ...environments[process.env.ENV],
      'ENV': process.env.ENV,
      'IONIC_ENV': process.env.IONIC_ENV
    };
  }
};
