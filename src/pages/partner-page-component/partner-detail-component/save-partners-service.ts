import {Injectable} from "@angular/core";

@Injectable()
export class SavePartnersService {

  lastVisitedPartners = [];
  lastVisitedPartnersComplete = [];
  favorites = [];

  constructor() {

    let savedLastVisitedPartners = localStorage.getItem("savedLastVisitedPartners");
    let savedFavorites = localStorage.getItem("savedFavorites");
    let savedLastVisitedPartnersComplete = localStorage.getItem("savedLastVisitedPartnersComplete");

    if (savedLastVisitedPartners && savedLastVisitedPartners != "undefined") {
      this.lastVisitedPartners = JSON.parse(savedLastVisitedPartners);
    }
    
    if (savedFavorites && savedFavorites != "undefined") {
      this.favorites = JSON.parse(savedFavorites);
    }

    if (savedLastVisitedPartnersComplete && savedLastVisitedPartnersComplete != "undefined") {
      this.lastVisitedPartnersComplete = JSON.parse(savedLastVisitedPartnersComplete);
    }

  }

  saveLogo(pfNumber, imageString) {
    let localStorageKey = pfNumber + "logo";
    localStorage.setItem(localStorageKey, imageString);
  }

  saveCampaignImage(pfNumber, imageString) {
    let localStorageKey = pfNumber + "campaignImage";
    localStorage.setItem(localStorageKey, imageString);
  }

  savePartnerAndPartnerDetails(pfNumber, partner, partnerDetails, partnerType) {

    let now = Date.now();

    if (partner) {
      partner.offline = true;
      partner.fetchTime = now;
    }

    if (partnerDetails) {
      partnerDetails.offline = true;
      partnerDetails.fetchTime = now;
    }

    let index = this[partnerType].indexOf(pfNumber);
    if (index > -1) {
      this[partnerType].splice(index, 1);
    }
    this[partnerType].push(pfNumber);
    if (partnerType == "lastVisitedPartners") {
      this.deleteLastVisitedPartnersIfTooMany();
      let indexInLastVisitedPartnersByPf = this.lastVisitedPartnersComplete.indexOf(pfNumber);
      if (indexInLastVisitedPartnersByPf > -1) {
        this.lastVisitedPartnersComplete.splice(index, 1);
      }
      this.lastVisitedPartnersComplete.push(pfNumber);
    }

    localStorage.setItem("savedLastVisitedPartners", JSON.stringify(this.lastVisitedPartners));
    localStorage.setItem("savedFavorites", JSON.stringify(this.favorites));
    localStorage.setItem("savedLastVisitedPartnersComplete", JSON.stringify(this.lastVisitedPartnersComplete));
    localStorage.setItem(pfNumber + "partner", JSON.stringify(partner));
    localStorage.setItem(pfNumber + "partnerDetails", JSON.stringify(partnerDetails));

    if (partner) {
      partner.offline = false;
    }

    if (partnerDetails) {
      partnerDetails.offline = false;
    }

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
      let indexInLastVisitedPartnersByPf = this.lastVisitedPartnersComplete.indexOf(pfNumber);
      if (index > -1) {
        this.lastVisitedPartners.splice(index, 1);
      }
      if (indexInLastVisitedPartnersByPf > -1) {
        this.lastVisitedPartnersComplete.splice(index, 1);
      }
      this.favorites.push(pfNumber)
    }
    else {
      let index = this.favorites.indexOf(pfNumber);
      if (index > -1) {
        this.favorites.splice(index, 1);
      }
      this.lastVisitedPartners.push(pfNumber);
      this.lastVisitedPartnersComplete.push(pfNumber);
      this.deleteLastVisitedPartnersIfTooMany();
    }
    localStorage.setItem("savedLastVisitedPartners", JSON.stringify(this.lastVisitedPartners));
    localStorage.setItem("savedFavorites", JSON.stringify(this.favorites));
    localStorage.setItem("savedLastVisitedPartnersComplete", JSON.stringify(this.lastVisitedPartnersComplete));

  }

  private deleteLastVisitedPartnersIfTooMany() {
    const maxNumberOfSavedLastVisitedPartners = 15;
    const maxNumberOfSavedLastVisitedPartnersComplete = 100;
    if (this.lastVisitedPartners.length > maxNumberOfSavedLastVisitedPartners) {
      this.deleteFromStorage(this.lastVisitedPartners[0], "lastVisitedPartners");
    }
    if (this.lastVisitedPartnersComplete.length > maxNumberOfSavedLastVisitedPartnersComplete) {
      this.lastVisitedPartnersComplete.splice(0, 1);
    }
  }

}
