import {Injectable} from "@angular/core";

@Injectable()
export class SavePartnersService {

  lastVisitedPartners = [];
  favorites = [];

  constructor() {
    let savedLastVisitedPartners = localStorage.getItem("savedLastVisitedPartners");
    let savedFavorites = localStorage.getItem("savedFavorites");
    if (savedLastVisitedPartners && savedLastVisitedPartners != "undefined") {
      this.lastVisitedPartners = JSON.parse(savedLastVisitedPartners);
    }
    if (savedFavorites && savedFavorites != "undefined") {
      this.favorites = JSON.parse(savedFavorites);
    }
  }

  saveLogo(pfNumber, imageString) {
    let localStorageKey = pfNumber + "logo";
    console.log(localStorageKey, imageString);
    localStorage.setItem(localStorageKey, imageString);
  }

  saveCampaignImage(pfNumber, imageString) {
    let localStorageKey = pfNumber + "campaignImage";
    localStorage.setItem(localStorageKey, imageString);
  }

  savePartnerAndPartnerDetails(pfNumber, partner, partnerDetails, partnerType) {
    let index = this[partnerType].indexOf(pfNumber);
    if (index > -1) {
      this[partnerType].splice(index, 1);
    }
    this[partnerType].push(pfNumber);
    if (partnerType == "lastVisitedPartners") {
      this.deleteLastVisitedPartnersIfTooMany();
    }
    localStorage.setItem("savedLastVisitedPartners", JSON.stringify(this.lastVisitedPartners));
    localStorage.setItem("savedFavorites", JSON.stringify(this.favorites));
    localStorage.setItem(pfNumber + "partner", JSON.stringify(partner));
    localStorage.setItem(pfNumber + "partnerDetails", JSON.stringify(partnerDetails));
  }

  deleteFromStorage(pfNumber, partnerType) {
    let index = this[partnerType].indexOf(pfNumber);
    if (index > -1) {
      this[partnerType].splice(index, 1);
    }
    localStorage.removeItem(pfNumber + "logo");
    localStorage.removeItem(pfNumber + "campaignImage");
    localStorage.removeItem(pfNumber + "partner");
    localStorage.removeItem(pfNumber + "partnerDetails");
  }

  togglePartnerType(pfNumber, newPartnerType) {
    if (newPartnerType == "favorites") {
      let index = this.lastVisitedPartners.indexOf(pfNumber);
      if (index > -1) {
        this.lastVisitedPartners.splice(index, 1);
      }
      this.favorites.push(pfNumber)
    }
    else {
      let index = this.favorites.indexOf(pfNumber);
      if (index > -1) {
        this.favorites.splice(index, 1);
      }
      this.lastVisitedPartners.push(pfNumber)
    }
  }

  private deleteLastVisitedPartnersIfTooMany() {
    const maxNumberOfSavedLastVisitedPartners = 3;
    if (this.lastVisitedPartners.length > maxNumberOfSavedLastVisitedPartners) {
      this.lastVisitedPartners.splice(0, 1);
    }
  }

}
