import {Component, ViewChild} from '@angular/core';
import {Content, NavController, NavParams} from 'ionic-angular';
import {style, state, trigger, transition, animate} from "@angular/animations";
import {PartnerService} from "../../../services/partner-service";
import {PartnerDetailComponent} from "../../partner-page-component/partner-detail-component/partner-detail-component";


@Component({
  providers: [],
  selector: 'page-user-specific-partners-component',
  templateUrl: 'user-specific-partners-component.html',
  animations: [trigger('show', [state('false', style({
    height: '0vh'
  })),
    state('true', style({
      height: '84vh'
    })),
    transition('false <=> true', animate('200ms'))
  ])]
})
export class UserSpecificPartnersComponent {

  title: string;
  partners = [];
  partnersInAlphabeticalOrder = [];
  partnersInChronologicalOrder = [];
  cached = false;
  sortByArray = [false, true];
  dropDownOpenForAnimation = 'false';
  @ViewChild(Content) content: Content;


  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public partnerService: PartnerService) {
    this.title = navParams.get("title");
    this.partners = navParams.get("partners");
    if (navParams.get("cached")) {
      this.cached = true;
      this.sortCachedArray();
    }
    else if (this.title === "Zuletzt besucht") {
      this.getAllLastVisitedPartners();
    }
  }

  sortCachedArray(){
    let duplicateArray = this.partners.slice();
    let secondDuplicateArray = this.partners.slice();
    this.partnersInAlphabeticalOrder = duplicateArray.sort((a,b)=>{
      return a.shortName.localeCompare(b.shortName);
    });
    this.partnersInChronologicalOrder = secondDuplicateArray;
  }

  getAllLastVisitedPartners() {
    let allLastVisitedPartners = JSON.parse(localStorage.getItem("savedLastVisitedPartnersComplete"));
    let location = {
      latitude: "52.5219",
      longitude: "13.4132"
    }
    this.partnerService.getPartners(location, 0, "", false, "SHORTNAME", "ASC", 10000, allLastVisitedPartners).subscribe((res) => {
        let partnersArray = res.json().contentEntities;
        let chronologicalOrderOfLastVisitedPartners = JSON.parse(localStorage.getItem("savedLastVisitedPartners"));
        let alphabeticalOrderOfLastVisitedPartners;
        this.cached = false;
        for (let partner of partnersArray){
          let maxLength = partnersArray.length;
          let position = maxLength - chronologicalOrderOfLastVisitedPartners.indexOf(partner.number) - 1;
          this.partnersInChronologicalOrder[position] = partner;
        }
        this.partners = this.partnersInChronologicalOrder;
        this.partnersInAlphabeticalOrder = partnersArray.sort((a,b)=>{
          return a.shortName.localeCompare(b.shortName);
        })
      },
      error => {
      })
  }


  showPartner(partner = 0) {
    this.navCtrl.push(PartnerDetailComponent, {partner: partner})
  }

  showCachedPartner(partner) {
    let partnerDetails = JSON.parse(localStorage.getItem(partner.number + "partnerDetails"));
    this.navCtrl.push(PartnerDetailComponent, {partner: partner, partnerDetails: partnerDetails})
  }

  toggleDropDown(){
    this.content.scrollToTop(0);
    this.dropDownOpenForAnimation = (this.dropDownOpenForAnimation === 'true' ? 'false' : 'true');
  }

  sortBy(string){
    if(string == "alphabet"){
      this.partners = this.partnersInAlphabeticalOrder;
      this.sortByArray = [true, false];

    }
    else {
      this.partners = this.partnersInChronologicalOrder;
      this.sortByArray = [false, true];
    }
    this.dropDownOpenForAnimation = 'false';
  }
}
