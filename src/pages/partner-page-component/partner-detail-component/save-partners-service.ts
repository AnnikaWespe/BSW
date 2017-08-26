import {Injectable} from "@angular/core";

const config = {

  storageKeyRecent: "partners_recent",
  storageKeyFavorites: "partners_favorites",
  storageKeyBonusBenefit: "bonus_benefit",
  storageKeyBonusBalance: "bonus_balance",
  storageKeyBonusTime: "bonus_time",
  storageKeyPartnerPrefix: "partner_",
  storageKeyPartnerGeneral: "_general",
  storageKeyPartnerDetail: "_detail",
  storageKeyPartnerLogo: "_logo",
  storageKeyPartnerCampaignImage: "_campaign_image",
  maxRecentCount: 20,
  cacheTime: 1000 * 60 * 60 * 24

};

@Injectable()
export class SavePartnersService {

  recentPartners = [];
  favorites = [];

  constructor() {

    let recent = localStorage.getItem(config.storageKeyRecent);
    if (recent && recent != "undefined") {
      this.recentPartners = JSON.parse(recent);
    }

    let favorites = localStorage.getItem(config.storageKeyFavorites);
    if (favorites && favorites != "undefined") {
      this.favorites = JSON.parse(favorites);
    }

    this.cleanup();

  }

  static saveLogo(pfNumber, imageString) {

    let localStorageKey = config.storageKeyPartnerPrefix + pfNumber + config.storageKeyPartnerLogo;

    if(imageString) {
      localStorage.setItem(localStorageKey, imageString);
    } else {
      localStorage.removeItem(localStorageKey);
    }

  }

  static saveCampaignImage(pfNumber, imageString) {

    let localStorageKey = config.storageKeyPartnerPrefix + pfNumber + config.storageKeyPartnerCampaignImage;

    if(imageString) {
      localStorage.setItem(localStorageKey, imageString);
    } else {
      localStorage.removeItem(localStorageKey);
    }

  }

  private addToRecentPartners(pfNumber){

    let index;
    while((index = this.recentPartners.indexOf(pfNumber)) >= 0){
      this.recentPartners.splice(index, 1);
    }

    this.recentPartners.push(pfNumber);
    localStorage.setItem(config.storageKeyRecent, JSON.stringify(this.recentPartners));

  }

  private removeRecentPartners(){

    let count = this.recentPartners.length - config.maxRecentCount;
    if(count > 0){
      this.recentPartners.splice(0, count);
      localStorage.setItem(config.storageKeyRecent, JSON.stringify(this.recentPartners));
    }

  }

  public storePartnerAndPartnerDetails(pfNumber, partner, partnerDetails) {

    let now = Date.now();

    if (partner) {
      partner.fetchTime = now;
    }

    if (partnerDetails) {
      partnerDetails.fetchTime = now;
    }

    this.addToRecentPartners(pfNumber);
    this.removeRecentPartners();

    localStorage.setItem(config.storageKeyPartnerPrefix + pfNumber + config.storageKeyPartnerGeneral, JSON.stringify(partner));
    localStorage.setItem(config.storageKeyPartnerPrefix + pfNumber + config.storageKeyPartnerDetail, JSON.stringify(partnerDetails));

  }

  private static clearPartner(pfNumber) {
    localStorage.removeItem(config.storageKeyPartnerPrefix + pfNumber + config.storageKeyPartnerGeneral);
    localStorage.removeItem(config.storageKeyPartnerPrefix + pfNumber + config.storageKeyPartnerDetail);
    localStorage.removeItem(config.storageKeyPartnerPrefix + pfNumber + config.storageKeyPartnerLogo);
    localStorage.removeItem(config.storageKeyPartnerPrefix + pfNumber + config.storageKeyPartnerCampaignImage);
  }

  public saveFavoriteList(favorites){
      this.favorites = favorites;
      localStorage.setItem(config.storageKeyFavorites, JSON.stringify(this.favorites));
  }

  public addToFavorites(pfNumber){

    if(this.favorites.indexOf(pfNumber) == -1){
      this.favorites.push(pfNumber);
      localStorage.setItem(config.storageKeyFavorites, JSON.stringify(this.favorites));
    }

  }

  public removeFromFavorites(pfNumber){

    let index = this.favorites.indexOf(pfNumber);
    if(index >= 0){
      this.favorites.slice(index, 1);
      localStorage.setItem(config.storageKeyFavorites, JSON.stringify(this.favorites));
    }

  }

  public static storeBonus(benefit, balance){
    localStorage.setItem(config.storageKeyBonusBenefit, benefit);
    localStorage.setItem(config.storageKeyBonusBalance, balance);
    localStorage.setItem(config.storageKeyBonusTime, Date.now().toString());
  }

  public static clearBonus(){
    localStorage.removeItem(config.storageKeyBonusBenefit);
    localStorage.removeItem(config.storageKeyBonusBenefit);
    localStorage.removeItem(config.storageKeyBonusTime);
  }

  public static loadBonus(){

    if (localStorage.getItem(config.storageKeyBonusBenefit)) {

      let bonus :any;
      bonus = {};
      bonus.benefit = Number(localStorage.getItem(config.storageKeyBonusBenefit));
      bonus.balance = Number(localStorage.getItem(config.storageKeyBonusBenefit));
      return bonus;

    }

    return null;

  }

  public static loadPartner(pfNumber){

    if (localStorage.getItem(config.storageKeyPartnerPrefix + pfNumber + config.storageKeyPartnerDetail)) {

      let partner :any;
      partner = {};
      partner.logo = localStorage.getItem(config.storageKeyPartnerPrefix + pfNumber + config.storageKeyPartnerLogo);
      partner.campaignImage = localStorage.getItem(config.storageKeyPartnerPrefix + pfNumber + config.storageKeyPartnerCampaignImage);
      partner.general = localStorage.getItem(config.storageKeyPartnerPrefix + pfNumber + config.storageKeyPartnerGeneral);
      partner.detail = localStorage.getItem(config.storageKeyPartnerPrefix + pfNumber + config.storageKeyPartnerDetail);
      return partner;

    }

    return null;

  }

  public static loadRecentPartners(){
    return JSON.parse(localStorage.getItem(config.storageKeyRecent)) || [];
  }

  public static loadFavoritePartners(){
    return JSON.parse(localStorage.getItem(config.storageKeyFavorites)) || [];
  }

  /* ensures that no data older than 24 hour is kept stored */
  public cleanup() {

    let now = Date.now();

    /* bonusdata - delete if older than 24 hours */
    let bonusTime = Number(localStorage.getItem(config.storageKeyBonusTime));
    if (bonusTime && bonusTime < (now - config.cacheTime)) {
      SavePartnersService.clearBonus();
    }

    /* partners - delete if older than 24 hours */
    let partnersToDelete = [];
    let allPartners = this.favorites.concat(this.recentPartners);

    for (let p in allPartners) {

      let loadedPartner = JSON.parse(localStorage.getItem(config.storageKeyPartnerPrefix + allPartners[p] + config.storageKeyPartnerDetail));
      if (loadedPartner && (!loadedPartner.fetchTime || loadedPartner.fetchTime < (now - config.cacheTime))) {
        partnersToDelete.push(allPartners[p]);
      }

    }

    for (let p in partnersToDelete) {
      SavePartnersService.clearPartner(partnersToDelete[p]);
    }

  }

}
