import {Component, EventEmitter, Output, OnInit, Input, OnDestroy} from '@angular/core';
import {Observable} from 'rxjs/Observable'
import {Subject} from 'rxjs/Subject';

import 'rxjs/add/observable/of';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/map';

import {SearchCompletionService} from "../search-completion/search-completion-service";
import {SearchTermCompletion} from '../search-completion/search-term-completion';
import {GoogleAnalytics} from "@ionic-native/google-analytics";
import {LocationService} from "../../../services/location-service";


@Component({
  selector: 'typeahead',
  templateUrl: 'typeahead.html'
})
export class TypeaheadComponent implements OnInit, OnDestroy {

  text: string;
  @Input() mapIcon: boolean;
  @Output() closeSearchInterfaceEmitter = new EventEmitter();
  @Output() getPartnersWithSearchTermEmitter = new EventEmitter();
  @Output() toggleMapAndListEmitter = new EventEmitter();
  searchTerm = "";
  subscription: any;

  private searchTerms = new Subject<string>();
  searchTermCompletion: Observable<SearchTermCompletion[]>;


  constructor(private searchCompletionService: SearchCompletionService,
              private ga: GoogleAnalytics) {
    this.subscription = this.searchTerms.subscribe(term => console.log(term))
  }

  search(term: string, $event): void {
    if ($event.keyCode == 13) {
      if (this.searchTerm.length > 0) {
        this.getPartnersWithSearchTermEmitter.emit(this.searchTerm);
        if (localStorage.getItem("disallowUserTracking") === "false") {
          this.ga.trackEvent("Suchbegriff", this.searchTerm)
        }
        this.searchTermCompletion = Observable.of<SearchTermCompletion[]>([]);
      }
      else {
        this.closeSearchInterface();
      }
    }
    else {
      this.searchTerms.next(term)
    }
  }

  ngOnInit(): void {
    const searchTermsObservable = () => {
      return this.searchTerms
        .debounceTime(300)
        .distinctUntilChanged()
        .switchMap(term => term
          ? this.searchCompletionService.getSuggestions(term, localStorage.getItem("latitude"), localStorage.getItem("longitude"))
          : Observable.of<SearchTermCompletion[]>([]))
        .catch(error => {
          console.log(error);
          return searchTermsObservable();
        });
    };
    this.searchTermCompletion = searchTermsObservable();
  };

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }


  closeSearchInterface() {
    this.closeSearchInterfaceEmitter.emit();
  }

  completeSearchTerm(searchTerm) {
    this.getPartnersWithSearchTermEmitter.emit(searchTerm);
    if (localStorage.getItem("disallowUserTracking") === "false") {
      this.ga.trackEvent("Suchbegriff", searchTerm)
    }
    this.searchTermCompletion = Observable.of<SearchTermCompletion[]>([]);
  }

  deleteSearchTerm() {
    this.searchTerm = "";
    this.searchTermCompletion = Observable.of<SearchTermCompletion[]>([]);
  }

}




