import {OnInit, Directive, Component} from '@angular/core';
import { GoogleMapsAPIWrapper } from 'angular2-google-maps/core';
import {LocationService} from '../../../../app/locationService';
declare let google: any;

@Directive({
  selector: 'styled-map-partner-details',
  //templateUrl: 'styled-map-partner-details-directive.html'
})

export class StyledMapPartnerDetails implements OnInit{

  travelTimePublic: string = "initialString";
  travelTimeCar: string;
  travelTimePedestrian: string;

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
      let origin = LocationService.latitude + ', ' + LocationService.longitude;
      let destination = "48, 11";
      let directionsService = new google.maps.DirectionsService();

      let requestCar = new request(google.maps.DirectionsTravelMode.DRIVING);
      let requestPedestrian = new request(google.maps.DirectionsTravelMode.WALKING);
      let requestPublic = new request(google.maps.DirectionsTravelMode.TRANSIT);

      function request(travelMode){
        this.origin = origin;
        this.destination = destination;
        this.travelMode = travelMode;
      }
      let shortenStringTravelTime = function(string){
        string = string.replace("Stunden", "Std")
          .replace("Stunde", "Std")
          .replace("Minuten", "Min")
          .replace("Minute", "Min")
          .replace(",", "");
        return(string);
      }

      bounds.extend({lat: 48, lng: 11});
      if(LocationService.locationFound){
        bounds.extend({lat: Number(LocationService.latitude), lng: Number(LocationService.longitude)});
      }
      m.setOptions({
        streetViewControl: false,
        //styles: stylesArray
      });
      m.fitBounds(bounds);
      directionsService.route(requestPublic, (response, status) => {
        if (status == 'OK'){
          let point = response.routes[ 0 ].legs[ 0 ];
          this.travelTimePublic = shortenStringTravelTime(point.duration.text);
          console.log("die Reisezeit beträgt: " + this.travelTimePublic);
          console.log(this);
        }
      });
      directionsService.route(requestCar, function(response, status){
        if (status == 'OK'){
          let point = response.routes[ 0 ].legs[ 0 ];
        }
      });
      directionsService.route(requestPedestrian, function(response, status){
        if (status == 'OK'){
          let point = response.routes[ 0 ].legs[ 0 ];
        }
      });
    });
  }


}
