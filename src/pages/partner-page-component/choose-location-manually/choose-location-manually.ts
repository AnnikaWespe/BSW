import { Component } from '@angular/core';

/*
  Generated class for the ChooseLocationManually component.

  See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
  for more info on Angular 2 Components.
*/
@Component({
  selector: 'choose-location-manually',
  templateUrl: 'choose-location-manually.html'
})
export class ChooseLocationManuallyComponent {

  lat: number = 51.1656;
  lng: number = 10.4515;
  zoom: number = 6;
  title: string = 'Standort auswählen';


}
