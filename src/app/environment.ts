const environments = {

  TEST: {
    BASE_URL: "https://vorsystem.avs.de/integ6",
    BASE_URL_APP_SEARCH: "https://www.bsw.de"
  },

  PROD: {
    BASE_URL: "https://vorsystem.avs.de/prod",
    BASE_URL_APP_SEARCH: "https://www.bsw.de"
  },

  PROXY: {
    BASE_URL: "http://localhost:8100",
    BASE_URL_APP_SEARCH: "http://localhost:8100",
  }

};

export const environment = environments.TEST;

// GENERAL URLS
export const urls = {

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


};
