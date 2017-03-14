import {Component, OnInit, Renderer, AfterViewChecked} from '@angular/core';
import {NavController, NavParams} from 'ionic-angular';
import {Geolocation} from 'ionic-native';
import {PartnerService} from "../../services/partner-service";
import {ChooseLocationManuallyComponent} from "./choose-location-manually/choose-location-manually-component";
import {AlertController} from 'ionic-angular';
import {PartnerDetailComponent} from "./partner-detail-component/partner-detail-component";
import {LocationService} from "../../services/locationService";



@Component({
  selector: 'partner-page-component',
  templateUrl: 'partner-page-component.html',
})
export class PartnerPageComponent implements OnInit, AfterViewChecked {
  title = "Partner";
  mode = "Observable";

  showDropdown: boolean[] = [false, false];
  waitingForResults: boolean = true;

  errorMessage: string;

  location = {latitude: "0", longitude: "0"};
  chosenLocation: {latitude: string, longitude: string};
  locationFound: boolean = false;
  locationChosen: boolean = false;

  activeFilterFromMenu: string;
  iconToggleMapAndList: string = "heart";
  showMap: boolean = false;
  disableMapAndSearch = false;

  partners: any[] = [];
  displayedPartners: any[] = [];
  localPartners = [];
  resetPartnersArray: boolean = true;

  category: string;
  bucket: number = 0;
  searchTerm = "";

  searchInterfaceOpen: boolean = false;

  selected = {
    "Entertainment": false,
    "Beauty": false,
    "Sport & Freizeit": false,
    "Gesundheit": false,
    "Wohnen": false,
    "Mode": false,
    "Multimedia": false
  };
  allSelected = {
    "entertainment": true,
    "Beauty": true,
    "Sport & Freizeit": true,
    "Gesundheit": true,
    "Wohnen": true,
    "Mode": true,
    "Multimedia": true
  };
  noneSelected = {
    "entertainment": false,
    "Beauty": false,
    "Sport & Freizeit": false,
    "Gesundheit": false,
    "Wohnen": false,
    "Mode": false,
    "Multimedia": false
  }

  categories = [ "Entertainment", "Beauty", "Sport & Freizeit", "Gesundheit", "Wohnen", "Mode", "Multimedia"];
  searchCategories = "";



  constructor(public navCtrl: NavController, public navParams: NavParams, private partnerService: PartnerService,
              private renderer: Renderer, public alertCtrl: AlertController) {
    this.activeFilterFromMenu = navParams.get('filterParameter');
    this.searchTerm = navParams.get('searchTerm') || "";
    this.title = navParams.get("title");
    this.category = this.activeFilterFromMenu;
    this.chosenLocation = navParams.get('location');
  }

  public ngAfterViewChecked() {
    this.setFocus();
  }

  ngOnInit() {
    if (this.chosenLocation) {
      this.location = this.chosenLocation;
      this.locationChosen = true;
      this.getPartners();
      LocationService.latitude = this.location.latitude;
      LocationService.longitude = this.location.longitude;
      LocationService.locationExact = true;
      LocationService.locationAvailable = true;
    }
    else {
      this.getLocationData();
    }
  };

  showPrompt() {
    let prompt = this.alertCtrl.create({
      title: 'Kein Standort gefunden',
      message: "Wollen Sie Ihren Standort manuell eingeben?",
      buttons: [
        {
          text: 'Ohne Standort fortfahren',
          handler: data => {
            this.getPartners();
            LocationService.locationAvailable = false;
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

  getLocationData() {
    Geolocation.getCurrentPosition().then((position) => {
      this.location.latitude = position.coords.latitude.toFixed(4);
      this.location.longitude = position.coords.longitude.toFixed(4)
      this.locationFound = true;
      console.log(this.location);
      this.getPartners();
      LocationService.latitude = this.location.latitude;
      LocationService.longitude = this.location.longitude;
      LocationService.locationExact = true;
      LocationService.locationAvailable = true;
    }, (err) => {
      console.log(err);
      this.showPrompt();
    })
  }

  getPartnersWithSearchTerm(searchTerm){
    this.searchTerm = searchTerm + " ";
    this.getPartners();
  }

  getPartners() {
    console.log(this.location, this.bucket, this.searchTerm);
    if (this.resetPartnersArray == true) {
      this.displayedPartners = [];
      this.waitingForResults = true;
    }
    this.partnerService.getPartners(this.location, this.bucket, this.searchTerm + this.searchCategories)
      .subscribe(
        body => {
          let returnedObject = body.json();
          this.getRightCategoryPartners(returnedObject);
        },
        error => this.errorMessage = <any>error);
  }

  getRightCategoryPartners(returnedObject) {
    if (this.category == "allpartners") {
      this.displayedPartners = this.displayedPartners.concat(returnedObject.contentEntities);
    }
    else {
      this.displayedPartners = this.displayedPartners.concat(returnedObject.originalSearchResults.bucketToSearchResult[this.category].contentEntities);
    }
    this.localPartners = this.localPartners.concat(returnedObject.originalSearchResults.bucketToSearchResult["OFFLINEPARTNER"].contentEntities);
    console.log("length of displayed partners array:" + this.displayedPartners.length);
    this.waitingForResults = false;
  }

  filter(partnerType) {
    if (partnerType !== 'OFFLINEPARTNER' || this.locationFound || this.chosenLocation) {
      this.category = partnerType;
      this.resetPartnersArray = true;
      this.getPartners();
      this.showDropdown = [false, false];
      this.waitingForResults = true;
    }
  }

  chooseLocationManually() {
    event.stopPropagation();
    this.navCtrl.push(ChooseLocationManuallyComponent, {location: this.location});
    this.showDropdown = [false, false];
  }


  showPartner(partner = 0) {
    //TODO: nächste Zeile löschen
    this.navCtrl.push(PartnerDetailComponent);
    if (this.showDropdown[0] === false && this.showDropdown[1] === false) {
      this.navCtrl.push(PartnerDetailComponent)
    }
  }

  toggleMapAndList(){
    console.log("toggleMapAndList");
    this.showMap = !this.showMap;
    this.showDropdown = [false, false];
    console.log("localPartners", this.localPartners)
  }

  filterByCategory(){
    this.searchCategories = "";
    for (let category of this.categories){
      if(this.selected[category] === true){
        this.searchCategories += category;
        this.searchCategories += " ";
      }
    }
    this.getPartners();
    this.showDropdown = [false, false];
    this.waitingForResults = true;
  }



//pure DOM methods

  private setFocus() {
    let searchInputField = document.getElementById('mySearchInputField');
    if (searchInputField) {
      searchInputField.focus();
    }
  }

  hideDropdown() {
    this.showDropdown = [false, false];
  }


  toggleVisibilityDropdowns(position) {
    let isVisible = this.showDropdown[position];
    this.showDropdown = [false, false];
    this.showDropdown[position] = !isVisible;
  }

  closeSearchInterface($event) {
    this.searchInterfaceOpen = false;
    this.searchTerm = "";
    this.showDropdown = [false, false];
    this.resetPartnersArray = true;
    this.title = "Partner"
    this.getPartners();
  }

  doInfinite(infiniteScroll) {
    this.bucket += 25;
    this.resetPartnersArray = false;
    this.getPartners();
    infiniteScroll.complete();
  }

  selectNone(){
    this.selected.Entertainment= false,
      this.selected.Beauty= false,
      this.selected["Sport & Freizeit"]= false,
      this.selected.Gesundheit= false,
      this.selected.Wohnen= false,
      this.selected.Mode= false,
      this.selected.Multimedia= false
  }
  selectAll(){
    this.selected.Entertainment= true,
      this.selected.Beauty= true,
      this.selected["Sport & Freizeit"]= true,
      this.selected.Gesundheit= true,
      this.selected.Wohnen= true,
      this.selected.Mode= true,
      this.selected.Multimedia= true
  }
}





