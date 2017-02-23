import { Component } from '@angular/core';

/*
  Generated class for the PartnerTable component.

  See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
  for more info on Angular 2 Components.
*/
@Component({
  selector: 'partner-table',
  templateUrl: 'partner-table.html'
})
export class PartnerTableComponent {

  text: string;

  constructor() {
    console.log('Hello PartnerTable Component');
    this.text = 'Hello World';
  }

}
