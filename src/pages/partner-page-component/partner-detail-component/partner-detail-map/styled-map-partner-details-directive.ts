import {OnInit, Directive, Output, EventEmitter} from '@angular/core';
import { GoogleMapsAPIWrapper } from 'angular2-google-maps/core';
import {LocationService} from '../../../../services/locationService';
declare let google: any;

class Request {
  public origin = LocationService.latitude + ', ' + LocationService.longitude;
  public destination = '48, 11';

  constructor(public travelMode) {}
}

@Directive({
  selector: 'styled-map-partner-details',
})
export class StyledMapPartnerDetailsDirective implements OnInit{

  @Output() travelTimePublicUpdated: EventEmitter<string> = new EventEmitter();

  travelTimePublic: string = 'initialString';
  travelTimeCar: string;
  travelTimePedestrian: string;

  constructor(private googleMapsWrapper: GoogleMapsAPIWrapper) {}

  ngOnInit(){
    this.googleMapsWrapper.getNativeMap()
    .then((map) => {
      this.setMapOptions(map);
      this.initializeDirectionService();
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

    bounds.extend({lat: 48, lng: 11});
    if(LocationService.locationAvailable){
      bounds.extend({lat: Number(LocationService.latitude), lng: Number(LocationService.longitude)});
    }
    map.setOptions({
      streetViewControl: false
      // styles: stylesArray
    });
    map.fitBounds(bounds);
  }

  private initializeDirectionService() {
    let directionsService = new google.maps.DirectionsService();

    let requestCar = new Request(google.maps.DirectionsTravelMode.DRIVING);
    let requestPedestrian = new Request(google.maps.DirectionsTravelMode.WALKING);
    let requestPublic = new Request(google.maps.DirectionsTravelMode.TRANSIT);

    let shortenStringTravelTime = function(string) {
      string = string.replace("Stunden", "Std")
        .replace("Stunde", "Std")
        .replace("Minuten", "Min")
        .replace("Minute", "Min")
        .replace(",", "");
      return(string);
    }

    directionsService.route(requestPublic, (response, status) => {
      if (status == 'OK') {
        let point = response.routes[ 0 ].legs[ 0 ];
        let travelTimePublic = shortenStringTravelTime(point.duration.text);
        console.log("die Reisezeit beträgt: " + this.travelTimePublic);

        this.travelTimePublicUpdated.emit(travelTimePublic);
      }
    });
    directionsService.route(requestCar, function(response, status) {
      if (status == 'OK') {
        let point = response.routes[ 0 ].legs[ 0 ];
      }
    });
    directionsService.route(requestPedestrian, function(response, status) {
      if (status == 'OK') {
        let point = response.routes[ 0 ].legs[ 0 ];
      }
    });
  }
}
