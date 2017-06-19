import {Component} from '@angular/core';
import {NavController, NavParams} from 'ionic-angular';
import {FavoritesData} from "../../../services/favorites-data";
import {PartnerService} from "../../../services/partner-service";
import {PartnerDetailComponent} from "../../partner-page-component/partner-detail-component/partner-detail-component";


@Component({
  providers: [],
  selector: 'page-user-specific-partners-component',
  templateUrl: 'user-specific-partners-component.html',
})
export class UserSpecificPartnersComponent {

  title: string;
  partners = [];
  waitingForResults = true;
  cached = false;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public partnerService: PartnerService) {
    this.title = navParams.get("title");
    if (this.title === "Favoriten") {
      this.cached = navParams.get("fromCache");
      this.treatAsFavoritesPage();
    }
    else {
      this.cached = true;
      this.treatAsLastVisitedPartnersPage();
    }
  }

  treatAsFavoritesPage() {
    let favoritesPfArray = FavoritesData.favoritesByPfArray;
    if(this.cached){
      let cachedFavoritesArray = JSON.parse(localStorage.getItem("savedFavorites")) || [];
      this.waitingForResults = false;
      for (let pfNumber of cachedFavoritesArray) {
        let partner = JSON.parse(localStorage.getItem(pfNumber + "partner"));
        partner.logoUrl = localStorage.getItem(pfNumber + "logo");
        this.partners.push(partner);
      }
    }
    else {
      let latitude = Number(localStorage.getItem("latitude"));
      let longitude = Number(localStorage.getItem("longitude"));
      this.partnerService.getPartners({latitude: latitude, longitude: longitude}, 0, "", false, 10000, favoritesPfArray)
        .subscribe((res) => {
        this.partners = res.json().contentEntities;
        this.waitingForResults = false;
      })
    }
  }

  treatAsLastVisitedPartnersPage() {
    let lastVisitedPartnersArray = JSON.parse(localStorage.getItem("savedLastVisitedPartners")) || [];
    this.waitingForResults = false;
    for (let pfNumber of lastVisitedPartnersArray) {
      console.log(localStorage.getItem(pfNumber + "logo"));
      let partner = JSON.parse(localStorage.getItem(pfNumber + "partner"));
      partner.logoString = localStorage.getItem(pfNumber + "logo");
      this.partners.push(partner);
    }
  }


  showPartner(partner = 0) {
    this.navCtrl.push(PartnerDetailComponent, {partner: partner})
  }

  showCachedPartner(partner){
    let partnerDetails = JSON.parse(localStorage.getItem(partner.number + "partnerDetails"));
    this.navCtrl.push(PartnerDetailComponent, {partner: partner, partnerDetails: partnerDetails})
  }
}
