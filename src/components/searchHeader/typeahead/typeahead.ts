import {Component, EventEmitter, Output, OnInit} from '@angular/core';
import {Observable} from 'rxjs/Observable'
import { Subject } from 'rxjs/Subject';

import 'rxjs/add/observable/of';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/map';

import {SearchCompletionService} from "../search-completion/search-completion-service";
import {SearchTermCompletion} from '../search-completion/SearchTermCompletion';
import {LocationService} from "../../../services/locationService.ts";




@Component({
  selector: 'typeahead',
  templateUrl: 'typeahead.html'
})
export class TypeaheadComponent implements OnInit {

  text: string;
  @Output() closeSearchInterfaceEmitter: EventEmitter<boolean> = new EventEmitter();
  @Output() getPartnersWithSearchTermEmitter: EventEmitter<string> = new EventEmitter();
  searchTerm: string;

  private searchTerms = new Subject<string>();
  searchTermCompletion2: Observable<SearchTermCompletion[]>;

  searchTermCompletion: SearchTermCompletion[];
  errorMessage: string;


  constructor(private searchCompletionService: SearchCompletionService) {
    this.searchTerms.subscribe(term => console.log(term))
  }

  search(term: string): void {
    console.log(term);
    this.searchTerms.next(term);
  }

  ngOnInit(): void {
    this.searchTermCompletion2 = this.searchTerms
      .debounceTime(300)
      .distinctUntilChanged()
      .switchMap(term => term
        ? this.searchCompletionService.getSuggestions(term)
        : Observable.of<SearchTermCompletion[]>([]))
      .catch(error => {
            console.log(error);
            return Observable.of<SearchTermCompletion[]>([]);
          });
  };



  closeSearchInterface($event) {
    this.closeSearchInterfaceEmitter.emit(true);
    this.searchTerm = "";
  }

  inputToSuggestions(event: any) {
    // if (event.keyCode !== 13) {
    //   this.getSearchSuggestions(event.target.value)
    // }
    // else if (event.keyCode == 13 && this.searchTerm.length > 1) {
    //   this.getPartnersWithSearchTermEmitter.emit(this.searchTerm);
    //   this.searchTermCompletion = [];
    // }
    console.log(event);
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




