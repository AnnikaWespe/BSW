import {Component, EventEmitter, Output} from '@angular/core';
import {SearchCompletionService} from "../search-completion/search-completion-service";
import {SearchTermCompletion} from '../search-completion/SearchTermCompletion';
import {LocationService} from "../../../services/locationService.ts";


@Component({
  selector: 'typeahead',
  templateUrl: 'typeahead.html'
})
export class TypeaheadComponent {

  text: string;
  @Output() closeSearchInterfaceEmitter: EventEmitter<boolean> = new EventEmitter();
  @Output() getPartnersWithSearchTermEmitter: EventEmitter<string> = new EventEmitter();
  searchTerm: string;
  searchTermCompletion: SearchTermCompletion[];
  errorMessage: string;


  constructor(private searchCompletionService: SearchCompletionService) {
  }

  closeSearchInterface($event) {
    this.closeSearchInterfaceEmitter.emit(true);
    this.searchTerm = "";
  }

  inputToSuggestions(event: any) {
    if (event.keyCode !== 13) {
      this.getSearchSuggestions(event.target.value)
    }
    else if (event.keyCode == 13 && this.searchTerm.length > 1) {
      this.getPartnersWithSearchTermEmitter.emit(this.searchTerm);
    }
  }

  getSearchSuggestions(searchTermSnippet) {
    this.searchCompletionService.getSuggestions(this.searchTerm, LocationService.latitude, LocationService.longitude)
      .subscribe(
        data => {
          this.searchTermCompletion = data.results;
          console.log(this.searchTermCompletion);
          if (data.results) {
          }
        },
        error => this.errorMessage = <any>error)
  }
  deleteSearchTerm(){
    this.searchTerm = "";
  }

  completeSearchTerm(searchTerm){
    this.getPartnersWithSearchTermEmitter.emit(searchTerm);
    this.searchTermCompletion = [];
    this.searchTerm = searchTerm;
  }



}




