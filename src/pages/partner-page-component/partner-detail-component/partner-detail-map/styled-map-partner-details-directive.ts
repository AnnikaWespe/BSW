import {OnInit, Directive, Output, EventEmitter} from '@angular/core';
import {GoogleMapsAPIWrapper} from 'angular2-google-maps/core';
import {LocationService} from '../../../../services/location-service';
declare let google: any;


@Directive({
  selector: 'styled-map-partner-details',
})
export class StyledMapPartnerDetailsDirective implements OnInit {

  @Output() travelTimeCarUpdated: EventEmitter<string> = new EventEmitter();
  @Output() travelTimePublicUpdated: EventEmitter<string> = new EventEmitter();
  @Output() travelTimePedestrianUpdated: EventEmitter<string> = new EventEmitter();


  constructor(private googleMapsWrapper: GoogleMapsAPIWrapper) {
  }

  ngOnInit() {
    this.googleMapsWrapper.getNativeMap()
      .then((map) => {
        this.setMapOptions(map);
        this.extendBounds(map);
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

  }

  private extendBounds(map) {
    let bounds = new google.maps.LatLngBounds();

    bounds.extend({lat: 48.1300, lng: 11.5700});
    if (LocationService.locationAvailable) {
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
    let origin = new google.maps.LatLng(LocationService.latitude, LocationService.longitude);
    let destination = new google.maps.LatLng(48.1300, 11.5700);

    let requestPublic = {origin: origin, destination: destination, travelMode: google.maps.TravelMode.TRANSIT};
    let requestCar = {origin: origin, destination: destination, travelMode: google.maps.TravelMode.DRIVING};
    let requestPedestrian = {origin: origin, destination: destination, travelMode: google.maps.TravelMode.WALKING};

    let shortenStringTravelTime = function (string) {
      string = string.replace("Stunden", "Std")
        .replace("Stunde", "Std")
        .replace("Minuten", "Min")
        .replace("Minute", "Min")
        .replace(",", "");
      return (string);
    }

    directionsService.route(requestPublic, (response, status) => {
      if (status == 'OK') {
        let point = response.routes[0].legs[0];
        let travelTimePublic = shortenStringTravelTime(point.duration.text);
        this.travelTimePublicUpdated.emit(travelTimePublic);
        console.log("travelTimePublic: " + travelTimePublic);
      }
      else(console.log(response));
    });
    directionsService.route(requestCar, (response, status) => {
      if (status == 'OK') {
        let point = response.routes[0].legs[0];
        let travelTimeCar = shortenStringTravelTime(point.duration.text);
        this.travelTimeCarUpdated.emit(travelTimeCar);
        console.log("travelTimeCar: " + travelTimeCar);
      }
    });
    directionsService.route(requestPedestrian, (response, status) => {
      if (status == 'OK') {
        let point = response.routes[0].legs[0];
        let travelTimePedestrian = shortenStringTravelTime(point.duration.text);
        this.travelTimePedestrianUpdated.emit(travelTimePedestrian);
        console.log("travelTimePedestrian: " + travelTimePedestrian);
      }
    });
  }
}
