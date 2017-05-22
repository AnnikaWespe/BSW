import {Component} from '@angular/core';
import {NavController, NavParams} from 'ionic-angular';
import {FavoritesData} from "../../../services/favorites-data";
import {PartnerService} from "../../../services/partner-service";


@Component({
  providers: [],
  selector: 'page-user-specific-partners-component',
  templateUrl: 'user-specific-partners-component.html',
})
export class UserSpecificPartnersComponent {

  title: string;
  partners: any[];
  waitingForResults = true;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public partnerService: PartnerService) {
    this.title = navParams.get("title");
    if (this.title === "Favoriten") {
      this.treatAsFavoritesPage();
    }
    else {
      this.treatAsLastVisitedPartnersPage();
    }
  }

  treatAsFavoritesPage() {
    let favoritesPfArray = FavoritesData.favoritesByPfArray;
    this.partnerService.getPartners({latitude: Number(localStorage.getItem("latitude")), longitude: Number(localStorage.getItem("longitude"))}, 0, "", false, 10000, favoritesPfArray).subscribe((res) => {
      this.partners = res.json().contentEntities;
      this.waitingForResults = false;
    })
  }

  treatAsLastVisitedPartnersPage() {
  }

}
