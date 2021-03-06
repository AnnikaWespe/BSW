import {Component, ViewChild} from '@angular/core';
import {Content, NavController, NavParams} from 'ionic-angular';
import {style, state, trigger, transition, animate} from "@angular/animations";
import {PartnerService} from "../../../services/partner-service";
import {PartnerDetailComponent} from "../../partner-page-component/partner-detail-component/partner-detail-component";
import {SavePartnersService} from "../../partner-page-component/partner-detail-component/save-partners-service";


@Component({
  providers: [],
  selector: 'page-user-specific-partners-component',
  templateUrl: 'user-specific-partners-component.html',
  animations: [trigger('show', [state('false', style({
    display: 'none',
    height: '0'
  })),
    state('true', style({
      display: 'block',
      height: '100%'
    })),
    transition('false <=> true', animate('500ms ease-in-out'))
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
              public partnerService: PartnerService,
              private savePartnersService: SavePartnersService) {
    this.title = navParams.get("title");
  }

  ionViewWillEnter() {
    this.partners = this.navParams.get("partners");
    this.cached = (this.navParams.get("fromCache"));
    if (this.title === "Favoriten" || this.cached) {
      this.sortPartnersArray();
    }
    else {
      this.getAllLastVisitedPartners();
    }
  }

  sortPartnersArray(){
    let duplicateArray = this.partners.slice();
    let secondDuplicateArray = this.partners.slice();
    this.partnersInAlphabeticalOrder = duplicateArray.sort((a,b)=>{
      return a.shortName.localeCompare(b.shortName);
    });
    this.partnersInChronologicalOrder = secondDuplicateArray;
    console.log(duplicateArray);
    console.log(secondDuplicateArray);
  }

  getAllLastVisitedPartners() {

    let allLastVisitedPartners = SavePartnersService.loadRecentPartners();
    let location = {
      latitude: "52.5219",
      longitude: "13.4132"
    };

    this.partnerService.getPartners(location, 0, "", false, "SHORTNAME", "ASC", 10000, allLastVisitedPartners).subscribe((res) => {
        let partnersArray = res.json().contentEntities;
        let chronologicalOrderOfLastVisitedPartners = SavePartnersService.loadRecentPartners();
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
    console.log("showing partner");
    this.navCtrl.push(PartnerDetailComponent, {partner: partner})
  }

  showCachedPartner(partner) {
    let partnerDetails = JSON.parse(localStorage.getItem(partner.number + "partnerDetails"));
    console.log(partnerDetails);
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
