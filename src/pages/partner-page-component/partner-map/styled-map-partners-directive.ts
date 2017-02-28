import {OnInit, Directive, Output, EventEmitter, Input} from '@angular/core';
import { GoogleMapsAPIWrapper } from 'angular2-google-maps/core';
import {LocationService} from '../../../services/locationService';
declare let google: any;



@Directive({
  selector: 'styled-map-partners',
})
export class StyledMapPartnersDirective implements OnInit{

@Input() partners: any[];


  constructor(private googleMapsWrapper: GoogleMapsAPIWrapper) {}

  ngOnInit(){
    this.googleMapsWrapper.getNativeMap()
    .then((map) => {
      this.setMapOptions(map);
      this.placeMarkers(map);
    });
  }

  private setMapOptions(map: any) {
    // let stylesArray : any = [
    //   {
    //     featureType: "poi",
    //     elementType: "labels",
    //     stylers: [
    //       { visibility: "off" }
    //     ]
    //   }
    // ];
    let bounds = new google.maps.LatLngBounds();

    bounds.extend({lat: 48.1300, lng: 11.5700});
    if(LocationService.locationAvailable){
      bounds.extend({lat: Number(LocationService.latitude), lng: Number(LocationService.longitude)});
    }
    map.setOptions({
      streetViewControl: false
      // styles: stylesArray
    });
    map.fitBounds(bounds);
  }

  private placeMarkers(map){

  }
}

// var map = new google.maps.Map(document.getElementById('map'), {
//   zoom: 10,
//   center: new google.maps.LatLng(-33.92, 151.25),
//   mapTypeId: google.maps.MapTypeId.ROADMAP
// });
//
// var infowindow = new google.maps.InfoWindow();
//
// var marker, i;
//
// for (i = 0; i < locations.length; i++) {
//   marker = new google.maps.Marker({
//     position: new google.maps.LatLng(locations[i][1], locations[i][2]),
//     map: map
//   });
//
//   google.maps.event.addListener(marker, 'click', (function(marker, i) {
//     return function() {
//       infowindow.setContent(locations[i][0]);
//       infowindow.open(map, marker);
//     }
//   })(marker, i));
// }

