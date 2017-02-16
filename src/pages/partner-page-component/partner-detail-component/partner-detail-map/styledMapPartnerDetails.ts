import {Directive, OnInit} from '@angular/core';
import { GoogleMapsAPIWrapper } from 'angular2-google-maps/core';
import {LocationService} from '../../../../app/locationService';
declare let google: any;

@Directive({
  selector: 'styled-map-partner-details'
})

export class StyledMapPartnerDetails implements OnInit{


  constructor(private _wrapper: GoogleMapsAPIWrapper){}

  ngOnInit(){
    this._wrapper.getNativeMap().then((m) => {
      let stylesArray : any = [
        {
          featureType: "poi",
          elementType: "labels",
          stylers: [
            { visibility: "off" }
          ]
        }
      ];

      let bounds = new google.maps.LatLngBounds();
      bounds.extend({lat: 49, lng: 11});
      if(LocationService.locationFound){
        bounds.extend({lat: Number(LocationService.latitude), lng: Number(LocationService.longitude)});
      }
      m.setOptions({
        streetViewControl: false,
        //styles: stylesArray
      });
      m.fitBounds(bounds);
    });
  }

}
