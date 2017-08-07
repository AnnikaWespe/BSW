import {OnInit, Directive, Output, EventEmitter, Input} from '@angular/core';
import { GoogleMapsAPIWrapper } from '@agm/core/services/google-maps-api-wrapper';
import {MapMarkerService} from "../../../../services/map-marker-service";
declare let google: any;


@Directive({
  selector: 'styled-map-partner-details',
})
export class StyledMapPartnerDetailsDirective implements OnInit {

  @Output() travelTimeCarUpdated = new EventEmitter();
  @Output() travelTimePublicUpdated = new EventEmitter();
  @Output() travelTimePedestrianUpdated = new EventEmitter();
  @Input() partner;



  map;


  constructor(private googleMapsWrapper: GoogleMapsAPIWrapper,
              private mapMarkerService: MapMarkerService) {
  }

  ngOnInit() {
    console.log(this.partner);
    this.googleMapsWrapper.getNativeMap()
      .then((map) => {
        this.map = map;
        this.setMapOptions(map);
        this.extendBounds(map);
      });
  }

  private extendBounds(map) {
    let bounds = new google.maps.LatLngBounds();
    bounds.extend({lat: this.partner.location.latitude, lng: this.partner.location.longitude});
    if (localStorage.getItem("locationExact") === "true") {
      console.log("location Exact is so true");
      bounds.extend({lat: Number(localStorage.getItem("latitude")), lng: Number(localStorage.getItem("longitude"))});
    }
    map.fitBounds(bounds);
    this.mapMarkerService.getImageAsBase64("StyledMapPartnersDirective", this.partner.logoUrlForGMap, (imageAsBase64, validImage) => {
      let marker = this.mapMarkerService.getMarker(this.partner, imageAsBase64, validImage, map, bounds);
      this.initializeDirectionService();
    })
    map.setOptions({
      streetViewControl: false
    });
  }

  private
  initializeDirectionService() {

    let directionsService = new google.maps.DirectionsService();
    let origin = new google.maps.LatLng(Number(localStorage.getItem("latitude")), Number(localStorage.getItem("longitude")));
    let destination = new google.maps.LatLng(this.partner.location.latitude, this.partner.location.longitude);

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
      }
      else(console.log(response));
    });
    directionsService.route(requestCar, (response, status) => {
      if (status == 'OK') {
        let point = response.routes[0].legs[0];
        let travelTimeCar = shortenStringTravelTime(point.duration.text);
        this.travelTimeCarUpdated.emit(travelTimeCar);
      }
    });
    directionsService.route(requestPedestrian, (response, status) => {
      if (status == 'OK') {
        let point = response.routes[0].legs[0];
        let travelTimePedestrian = shortenStringTravelTime(point.duration.text);
        this.travelTimePedestrianUpdated.emit(travelTimePedestrian);
      }
    });
  }

  private setMapOptions(map: any) {
    map.setOptions({clickableIcons: false});
  }
}
