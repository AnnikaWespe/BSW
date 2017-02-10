import {Component, OnInit, ViewChild, ElementRef, Renderer, EventEmitter, AfterViewChecked} from '@angular/core';
import {NavController, NavParams} from 'ionic-angular';
import {Geolocation} from 'ionic-native';
import {PartnerService} from "./partner-service";
import {ChooseLocationManuallyComponent} from "./choose-location-manually/choose-location-manually";
import {SearchTermCompletion} from './search-completion/SearchTermCompletion';
import {SearchCompletionService} from "./search-completion/search-completion-service";


@Component({
  selector: 'partner-page-component',
  templateUrl: 'partner-page-component.html',
})
export class PartnerPageComponent implements OnInit, AfterViewChecked {
  title: string = "Partner";
  mode = "Observable";

  showDropdown: boolean[] = [false, false];
  waitingForResults: boolean = true;

  errorMessage: string;

  location: {latitude: number, longitude: number} = {latitude: 0, longitude: 0};
  locationFound: boolean = false;

  partners: any[] = [];
  displayedPartners: any[] = [];
  resetPartnersArray: boolean = true;

  category: string = "allpartners";
  bucket: number = 0;

  searchInterfaceOpen: boolean = false;
  searchSuggestionsOpen: boolean = false;
  iconLeft: string = "menu";
  iconRight: string = "search";
  searchTermCompletion: SearchTermCompletion[];
  noMatchesFound = [new SearchTermCompletion("Leider keine Übereinstimmung")];
  searchTerm: string = "";



  constructor(public navCtrl: NavController, public navParams: NavParams, private partnerService: PartnerService, private searchCompletionService: SearchCompletionService, private renderer: Renderer) {
  }

  public ngAfterViewChecked() {
    this.setFocus();
  }

  ngOnInit() {
    this.getLocationData();
  };


  getLocationData() {
    Geolocation.getCurrentPosition().then((position) => {
      this.location = position.coords;
      this.locationFound = true;
      this.getPartners();
    }, (err) => {
      console.log(err);
      this.getPartners();
    })
  }

  getPartners() {
    this.displayedPartners = [];
    this.waitingForResults = true;
    this.searchSuggestionsOpen = false;
    this.partnerService.getPartners(this.location, this.bucket, this.searchTerm)
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
    ;
    this.waitingForResults = false;
  }

  filter(partnerType) {
    if (this.locationFound) {
      this.category = partnerType;
      this.resetPartnersArray = true;
      this.getPartners();
      this.hideDropdown();
      this.waitingForResults = true;
    }
  }

  inputToSuggestions(event: any) {
    if(event.keyCode !== 13) {this.getSearchSuggestions(event.target.value)};
    if (event.keyCode === 8 && this.searchTerm === "") {
      this.searchSuggestionsOpen = false;
      this.resetPartnersArray = true;
      this.getPartners();
    }
    if(event.keyCode == 13 && this.searchTerm.length > 1){
      this.resetPartnersArray = true;
      this.getPartners();
    }
  }

  getSearchSuggestions(searchTermSnippet) {
    this.searchCompletionService.getSuggestions(searchTermSnippet, this.location.latitude, this.location.longitude)
      .subscribe(
        data => {
          this.searchTermCompletion = data.results;
          if (data.results) {
            this.searchSuggestionsOpen = true
          }
          else {
            this.searchTermCompletion = this.noMatchesFound
          }
          ;
          ;
        },
        error => this.errorMessage = <any>error)
  }

  completeSearchTerm(text) {
    this.searchTerm = text;
    this.searchSuggestionsOpen = false;
    this.resetPartnersArray = true;
    this.getPartners();
  }

  chooseLocationManually() {
    event.stopPropagation();
    this.navCtrl.push(ChooseLocationManuallyComponent);
    this.hideDropdown();
  }

  functionRightIcon() {
    if (!this.searchInterfaceOpen) {
      this.searchInterfaceOpen = true;
      this.iconLeft = "arrow-back";
      this.iconRight = "close-circle";
      this.hideDropdown();
    }
    else {
      this.searchTerm = "";
      this.searchSuggestionsOpen = false;
      this.resetPartnersArray = true;
      this.getPartners();
    }
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

  getMargin() {
    return this.searchSuggestionsOpen ? "54px" : "108px";
  }

  closeSearchInterface() {
    this.searchInterfaceOpen = false;
    this.searchSuggestionsOpen = false;
    this.hideDropdown();
    this.iconLeft = "menu";
    this.iconRight = "search";
    this.searchTerm = "";
    this.resetPartnersArray = true;
    this.getPartners();
  }

  doInfinite(infiniteScroll) {
    console.log("loadnextpartners");
    this.bucket += 1;
    this.resetPartnersArray = true;
    this.getPartners();
    infiniteScroll.complete();
  }
}





