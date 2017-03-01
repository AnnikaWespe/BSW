import {OnInit, Directive, Input} from '@angular/core';
import { GoogleMapsAPIWrapper } from 'angular2-google-maps/core';
declare let google: any;
declare let MarkerClusterer: any;



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
    map.setOptions({ clickableIcons: false });
  }


  private placeMarkers(map){
    let marker;
    let markers = [];
    let bounds = new google.maps.LatLngBounds();
    let markerClusterer;

    for (let partner of this.partners){
      let latitude = partner.location.latitude;
      let longitude = partner.location.longitude;
      let logo = partner.logoUrlForGMap;
      if (logo == "https://www.bsw.de/upload/bsw/partner-logo.png"){logo = ""}
      marker = new google.maps.Marker({
        position: new google.maps.LatLng(latitude, longitude),
        map: map,
        icon: logo
      });
      if (marker.icon === ""){
        marker.label = partner.nameOrigin;
      }
      markers.push(marker);

      google.maps.event.addListener(marker, 'click', (function(marker) {
        return function(){
        }
      })(marker));
      bounds.extend({lat: latitude, lng: longitude});
    }
    map.fitBounds(bounds);

    markerClusterer = new MarkerClusterer(map, markers,
      {imagePath: '../assets/icon/m'});
  }
}



