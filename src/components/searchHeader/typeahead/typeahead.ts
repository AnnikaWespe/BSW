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
  searchTerm: string;
  subscription: any;

  private searchTerms = new Subject<string>();
  searchTermCompletion: Observable<SearchTermCompletion[]>;


  constructor(private searchCompletionService: SearchCompletionService) {
    this.subscription = this.searchTerms.subscribe(term => console.log(term))
  }

  search(term: string, $event): void {
    if ($event.keyCode == 13 && this.searchTerm.length > 1) {
      this.getPartnersWithSearchTermEmitter.emit(this.searchTerm);
      this.searchTermCompletion = Observable.of<SearchTermCompletion[]>([]);
    }
    else {
      this.searchTerms.next(term)
    }
    ;
  }

  ngOnInit(): void {
    const searchTermsObservable = () => {
      return this.searchTerms
        .debounceTime(300)
        .distinctUntilChanged()
        .switchMap(term => term
          ? this.searchCompletionService.getSuggestions(term)
          : Observable.of<SearchTermCompletion[]>([]))
        .catch(error => {
          console.log(error);
          return searchTermsObservable();
        });
    }
    this.searchTermCompletion = searchTermsObservable();
  };

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }


  closeSearchInterface($event) {
    this.closeSearchInterfaceEmitter.emit();
  }

  completeSearchTerm(searchTerm) {
    this.getPartnersWithSearchTermEmitter.emit(searchTerm);
    this.searchTermCompletion = Observable.of<SearchTermCompletion[]>([]);
  }

  deleteSearchTerm() {
    this.searchTerm = "";
    this.searchTermCompletion = Observable.of<SearchTermCompletion[]>([]);
  }


  toggleMapAndList() {
    this.toggleMapAndListEmitter.emit(true);
  }

}




