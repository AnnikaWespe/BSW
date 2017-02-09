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

  location: {latitude: number, longitude: number};
  locationFound: boolean = false;

  partners: any[] = [];
  displayedPartners: any[] = [];

  category: string = "allpartners";
  bucket: number = 0;

  statusText: string;

  searchInterfaceOpen: boolean = false;
  searchSuggestionsOpen: boolean = false;
  iconLeft: string = "menu";
  iconRight: string = "search";
  searchTermCompletion: SearchTermCompletion[];
  noMatchesFound = [new SearchTermCompletion("Leider keine Übereinstimmung")];
  searchTerm: string;
  public focusTrigger = new EventEmitter<boolean>();



  values: string;

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
      this.getPartners(this.location, "");
    }, (err) => {
      console.log(err);
      this.getPartners(this.location, "");
    })
  }

  getPartners(location, searchTerm) {
    this.partnerService.getPartners(location, this.bucket)
      .subscribe(
        body => {
          let returnedObject = body.json();
          if (this.category == "allpartners") {
            this.displayedPartners = this.displayedPartners.concat(returnedObject.contentEntities);
          }
          else {
            this.displayedPartners = this.displayedPartners.concat(returnedObject.originalSearchResults.bucketToSearchResult[this.category].contentEntities);
          }
          ;
          this.waitingForResults = false;
          console.log(this.displayedPartners);
        },
        error => this.errorMessage = <any>error);

  }

  filter(partnerType) {
    if (this.locationFound) {
      this.category = partnerType;
      this.displayedPartners = [];
      this.getPartners(this.location, "");
      this.hideDropdown();
      this.waitingForResults = true;
    }
  }

  doInfinite(infiniteScroll) {
    console.log("loadnextpartners");
    this.bucket += 1;
    this.getPartners(this.location, "");
    infiniteScroll.complete();
  }


  inputToSuggestions(event: any) {
    this.getSearchSuggestions(event.target.value);
  }

  getSearchSuggestions(searchTerm) {
    this.searchCompletionService.getSuggestions(searchTerm, this.location.latitude || 0, this.location.longitude || 0)
      .subscribe(
        data => {
          this.searchTermCompletion = data.results;
          if (data.results) {this.searchSuggestionsOpen = true}
          else {this.searchTermCompletion = this.noMatchesFound};
          ;
        },
        error => this.errorMessage = <any>error)
  }

  completeSearchTerm(text){
  this.searchTerm = text;
  this.searchSuggestionsOpen = false;
  }


  getMargin() {
    return this.searchInterfaceOpen ? "54px" : "108px";
  }

  closeSearchInterface() {
    this.searchInterfaceOpen = false;
    this.iconLeft = "menu";
    this.iconRight = "search";
    this.searchTerm = "";
  }

  chooseLocationManually() {
    event.stopPropagation();
    this.navCtrl.push(ChooseLocationManuallyComponent);
    this.hideDropdown();
  }

  hideDropdown() {
    this.showDropdown = [false, false];
  }

  toggleVisibilityDropdowns(position) {
  let isVisible = this.showDropdown[position];
  this.showDropdown = [false, false];
  this.showDropdown[position] = !isVisible;
}

  functionRightIcon() {
    if (!this.searchInterfaceOpen) {
      this.searchInterfaceOpen = true;
      this.iconLeft = "arrow-back";
      this.iconRight = "search";
      this.hideDropdown();
    }
    else {
      this.closeSearchInterface()
    }
  }

  private setFocus() {
    let searchInputField = document.getElementById('mySearchInputField');
    if(searchInputField) {
      searchInputField.focus();
    }
  }

}





