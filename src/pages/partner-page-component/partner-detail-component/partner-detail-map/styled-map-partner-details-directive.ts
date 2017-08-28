import {OnInit, Directive, Output, EventEmitter, Input, OnDestroy} from '@angular/core';

import {Platform} from 'ionic-angular';

import { GoogleMapsAPIWrapper } from '@agm/core/services/google-maps-api-wrapper';
import {MapMarkerService} from "../../../../services/map-marker-service";
import {LocationService} from "../../../../services/location-service";
declare let google: any;


@Directive({
  selector: 'styled-map-partner-details',
})
export class StyledMapPartnerDetailsDirective implements OnInit, OnDestroy {
  @Output() travelTimeCarUpdated = new EventEmitter();
  @Output() travelTimePublicUpdated = new EventEmitter();
  @Output() travelTimePedestrianUpdated = new EventEmitter();
  @Input() partner;
  map;
  location: any;
  platformSubscription;

  constructor(private googleMapsWrapper: GoogleMapsAPIWrapper,
              private mapMarkerService: MapMarkerService,
              private platform: Platform,
              private locationService: LocationService)
  {
    this.location = this.locationService.getCurrentLocation();
    this.platformSubscription = this.platform.resume.subscribe(()=>{
      this.location = this.locationService.getCurrentLocation();
    });
  }

  ngOnDestroy() {
    if (this.platformSubscription){
      this.platformSubscription.unsubscribe();
    }
  }

  ngOnInit() {

    console.log(this.partner);

    this.googleMapsWrapper.getNativeMap()
      .then((map) => {
        this.map = map;
        this.setMapOptions(map);
        this.extendBounds(map);

        console.log("initializeDirectionService()");
        this.initializeDirectionService();

      });

  }

  private extendBounds(map) {

    let bounds = new google.maps.LatLngBounds();
    bounds.extend({lat: this.partner.location.latitude, lng: this.partner.location.longitude});

    /* if we have an exact position, zoom the map to bounds of my position and target */
    if (localStorage.getItem("locationExact") === "true") {
      console.log("location Exact is so true");
      bounds.extend({lat: Number(localStorage.getItem("latitude")), lng: Number(localStorage.getItem("longitude"))});
      map.fitBounds(bounds);

    } else {

      map.setZoom(14);
      map.setCenter({lat: this.partner.location.latitude, lng: this.partner.location.longitude})

    }

    this.mapMarkerService.getImageAsBase64("StyledMapPartnersDirective", this.partner.logoUrlForGMap, (imageAsBase64, validImage) => {
        this.mapMarkerService.getMarker(this.partner, imageAsBase64, validImage, map, bounds);
    });

    map.setOptions({
      streetViewControl: false
    });

  }

  private initializeDirectionService() {

    let directionsService = new google.maps.DirectionsService();
    let origin = new google.maps.LatLng(this.location.latitude, this.location.longitude);
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

      if(string && string.length > 0){
        return string
      } else {
        return "-";
      }

    };

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
