import {Component, OnInit, AfterViewChecked} from '@angular/core';
import {NavController, NavParams} from 'ionic-angular';
import {Geolocation} from 'ionic-native';
import {PartnerService} from "../../services/partner-service";
import {ChooseLocationManuallyComponent} from "./choose-location-manually/choose-location-manually-component";
import {AlertController} from 'ionic-angular';
import {PartnerDetailComponent} from "./partner-detail-component/partner-detail-component";
import {LocationData} from "../../services/location-data";

@Component({
  selector: 'partner-page-component',
  templateUrl: 'partner-page-component.html',
})
export class PartnerPageComponent implements OnInit, AfterViewChecked {
  title = "Partner";
  mode = "Observable";

  location : {};
  cityName : string;

  showDropdown: boolean[] = [false, false];
  waitingForResults: boolean = true;

  errorMessage: string;

  showMap = false;
  showMapIcon = false;

  displayedPartners = [];

  localPartners = [];
  onlinePartners = [];
  allPartners = [];
  partnersWithCampaign = [];
  resetPartnersArray: boolean = true;
  moreDataCanBeLoaded = true;

  showLocalPartners = false;
  showOnlinePartners = false;
  showOnlyPartnersWithCampaign = false;

  bucket: number = 0;
  searchTerm = "";

  searchInterfaceOpen: boolean = false;

  constructor(public navCtrl: NavController, public navParams: NavParams, private partnerService: PartnerService,
              public alertCtrl: AlertController) {
    this.setFilterParameters();
    this.setLocationData();
    this.searchTerm = navParams.get('searchTerm') || "";
    this.title = navParams.get("title");
  }

  public ngAfterViewChecked() {
    this.setFocus();
  }

  ngOnInit() {

  };

  setFilterParameters(){
    let activeFilter = this.navParams.get('activeFilter');
    this.displayedPartners = this[activeFilter];
    if (activeFilter == "onlinePartners") {
      this.showOnlinePartners = true;
    }
    if (activeFilter == "localPartners") {
      this.showLocalPartners = true;
    }
    if (activeFilter == "allPartners") {
      this.showOnlinePartners = true;
      this.showLocalPartners = true;
    }
  }

  setLocationData(){
    if(LocationData.locationAvailable){
      this.location = {
        latitude: LocationData.latitude,
        longitude: LocationData.longitude
      };
      this.cityName = LocationData.cityName;
    }
    else {
      this.showPrompt();
    }

  }

  showPrompt() {
    let prompt = this.alertCtrl.create({
      title: 'Kein Standort gefunden',
      message: "Wollen Sie Ihren Standort manuell eingeben?",
      buttons: [
        {
          text: 'Ohne Standort fortfahren',
          handler: data => {
            this.getPartners();
          }
        },
        {
          text: 'Ja',
          handler: data => {
            this.navCtrl.push(ChooseLocationManuallyComponent);
          }
        }
      ]
    });
    prompt.present();
  }

  getPartnersWithSearchTerm(searchTerm) {
    this.searchTerm = searchTerm + " ";
    this.getPartners();
  }

  getPartners() {
    console.log(this.location, this.bucket, this.searchTerm);
    if (this.resetPartnersArray == true) {
      this.allPartners = [];
      this.onlinePartners = [];
      this.localPartners = [];
      this.partnersWithCampaign = [];
      this.waitingForResults = true;
    }
    this.partnerService.getPartners(this.location, this.bucket, this.searchTerm)
      .subscribe(
        body => {
          let returnedObject = body.json();
          this.getDifferentCategories(returnedObject);
          if(!returnedObject.contentEntities){
            this.moreDataCanBeLoaded = false;
          }
        },
        error => this.errorMessage = <any>error);
  }

  getDifferentCategories(returnedObject) {
    this.allPartners = this.allPartners.concat(returnedObject.contentEntities);
    this.localPartners = this.localPartners.concat(returnedObject.originalSearchResults.bucketToSearchResult["OFFLINEPARTNER"].contentEntities);
    this.onlinePartners = this.onlinePartners.concat(returnedObject.originalSearchResults.bucketToSearchResult["ONLINEPARTNER"].contentEntities);
    this.getDisplay();
    this.waitingForResults = false;
  }

  chooseLocationManually() {
    event.stopPropagation();
    this.navCtrl.push(ChooseLocationManuallyComponent, {location: this.location});
    this.showDropdown = [false, false, false];
  }


  showPartner(partner = 0) {
    this.navCtrl.push(PartnerDetailComponent)
  }

  getDisplay() {
    if (!this.showLocalPartners && !this.showOnlinePartners) {
      this.askForValidCategories();
      return;
    }
    this.showDropdown = [false, false, false];
    if (this.showLocalPartners && !this.showOnlinePartners) {
      this.title = "Vor Ort Partner";
      this.filterCampaignPartners(this.localPartners);
    }
    else if (!this.showLocalPartners && this.showOnlinePartners) {
      this.title = "Online Partner";
      this.filterCampaignPartners(this.onlinePartners);
    }
    else if (this.showLocalPartners && this.showOnlinePartners) {
      this.title = "Alle Partner";
      this.filterCampaignPartners(this.allPartners)
    }
  }

  filterCampaignPartners(displayedPartners) {
    if (this.showOnlyPartnersWithCampaign) {
      let partnersWithCampaign = [];
      for (let partner of displayedPartners) {
        if (partner && partner.hasCampaign) {
          partnersWithCampaign.push(partner);
        }
        else if(partner == null){
          this.moreDataCanBeLoaded = false;
          this.displayedPartners = partnersWithCampaign;
          return;
        }
      }
      if (partnersWithCampaign.length < 7) {
        this.resetPartnersArray = false;
        this.bucket += 50;
        this.getPartners();
      }
      this.displayedPartners = partnersWithCampaign;
    }
    else {
      this.displayedPartners = displayedPartners
    }
  }

  askForValidCategories() {
    let prompt = this.alertCtrl.create({
      title: 'Bitte wählen Sie entweder "Vor-Ort-Partner" oder "Online Partner" aus',
      buttons: [
        {
          text: 'OK',
          handler: data => {
          }
        }
      ]
    });
    prompt.present();
  }

  toggleMapAndList() {
    this.showMap = !this.showMap;
    this.showDropdown = [false, false, false];
  }


//pure DOM methods

  private setFocus() {
    let searchInputField = document.getElementById('mySearchInputField');
    if (searchInputField) {
      searchInputField.focus();
    }
  }

  hideDropdown() {
    this.showDropdown = [false, false, false];
  }


  toggleVisibilityDropdowns(position) {
    let isVisible = this.showDropdown[position];
    let anythingVisible = this.showDropdown[2];
    this.showDropdown = [false, false];
    this.showDropdown[position] = !isVisible;
    this.showDropdown[2] = !anythingVisible;
  }

  closeSearchInterface($event) {
    this.searchInterfaceOpen = false;
    this.searchTerm = "";
    this.showDropdown = [false, false, false];
    this.resetPartnersArray = true;
    this.title = "Partner"
    this.getPartners();
  }

  doInfinite(infiniteScroll) {
    this.bucket += 50;
    this.resetPartnersArray = false;
    this.getPartners();
    infiniteScroll.complete();
  }

}





