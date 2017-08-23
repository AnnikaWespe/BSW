import {Directive, Input, Output, EventEmitter, OnChanges, OnDestroy} from '@angular/core';
import { GoogleMapsAPIWrapper } from '@agm/core/services/google-maps-api-wrapper';
import 'js-marker-clusterer/src/markerclusterer.js';
import {generate} from "../../Observable";
import {NavController, Platform} from 'ionic-angular';
import {DeviceService} from "../../../services/device-data";
import {PartnerService} from "../../../services/partner-service";
import {PartnerDetailComponent} from "../partner-detail-component/partner-detail-component";

import {Observable} from 'rxjs/Observable'
// import 'rxjs/add/observable/of';
// import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/Skip';
// import 'rxjs/add/operator/debounceTime';
// import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/throw';
import 'rxjs/add/observable/forkJoin';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/operator/combineLatest';
import {MapMarkerService} from "../../../services/map-marker-service";


declare let google: any;
declare let MarkerClusterer: any;

@Directive({
  selector: 'styled-map-partners',
})
export class StyledMapPartnersDirective implements OnDestroy{

  @Output() fillList = new EventEmitter();
  @Output() removeList = new EventEmitter();
  @Output() addList = new EventEmitter();
  @Input() justPartnersWithCampaign$: EventEmitter<boolean>;
  @Input() justPartnersWithCampaign: boolean;
  @Input() searchTerm$: EventEmitter<string>;
  @Input() searchTerm: string;

  getPartnersSubscription;
  map: any;
  pathToGmapsClusterIcons: string;
  markers = [];
  markerCache = {};
  markerClusterer;
  bucket = 0;
  center;
  radius;

  constructor(private googleMapsWrapper: GoogleMapsAPIWrapper,
              private partnerService: PartnerService,
              private navCtrl: NavController,
              private mapMarkerService: MapMarkerService) {
    if (DeviceService.isInBrowser) {
      this.pathToGmapsClusterIcons = '../assets/icon/m';
    }
    else if (DeviceService.isAndroid || DeviceService.isIos || DeviceService.isWindowsPhone) {
      this.pathToGmapsClusterIcons = '../www/assets/icon/m';
    }

    this.googleMapsWrapper.getNativeMap()
      .then((map) => {
        this.map = map;
        let bounds = new google.maps.LatLngBounds();
        this.setMapOptions(map);
        this.markerClusterer = new MarkerClusterer(
          map,
          [],
          {imagePath: this.pathToGmapsClusterIcons, gridSize: 120, minimumClusterSize: 3}
        );
        google.maps.event.addListener(this.markerClusterer, 'clusterclick', (cluster) => {
          this.fillList.emit(cluster.getMarkers());
          google.maps.event.trigger(map, 'resize');
        });
        const idle$ = Observable.create(observer => {
          map.addListener('idle', () => {
            observer.next();
          });
        }).skip(1);
        const center$ = idle$.map(() => {
          let newCenter = this.map.getCenter();
          let newLat = this.map.getCenter().lat().toFixed(4);
          let newLong = this.map.getCenter().lng().toFixed(4);
          let center = {latitude: newLat, longitude: newLong};
          let radius = this.getRadius(newCenter, this.map.getBounds().getNorthEast());
          return {center: center, radius: radius};
        })
        const partners$ = center$
          .combineLatest(
            this.justPartnersWithCampaign$.startWith(this.justPartnersWithCampaign),
            this.searchTerm$.startWith(this.searchTerm)
          )
          .switchMap((params) => {
            this.center = params[0].center;
            this.radius = params[0].radius;
            let showOnlyPartnersWithCampaign = params[1];
            let searchTerm = params[2];
            console.log(this.center, this.radius, showOnlyPartnersWithCampaign);
            return this.partnerService.getPartners(this.center, this.bucket, searchTerm, showOnlyPartnersWithCampaign, "RELEVANCE", "DESC", this.radius)
          })
          .map(body => {
            let returnedObject = body.json();
            let offlinePartners = returnedObject.originalSearchResults.bucketToSearchResult["OFFLINEPARTNER"].contentEntities;
            
            // JS: ist das Auskommentieren ein Problem?
            // this.clearMarkers();
            return offlinePartners;
          })
        const markers$ = partners$.switchMap((offlinePartners) => {
          let observables = [];
          if (offlinePartners == undefined) {
            return [];
          }
          offlinePartners.forEach((partner, index) => {
            let marker = this.markerCache[partner.id];
            if(marker){
              return;
            }
            let observable = Observable.create(observer => {
                this.mapMarkerService.getImageAsBase64("StyledMapPartnersDirective", partner.logoUrlForGMap,
                  (imageAsBase64, validImage) => {
                    marker = this.mapMarkerService.getMarker(partner, imageAsBase64, validImage, null, bounds);
                    google.maps.event.addListener(marker, 'click', ((marker) => {
                      return () => {
                        this.navCtrl.push(PartnerDetailComponent, {partner: partner});
                      }
                    })(marker));
                    observer.next(marker);
                    observer.complete();
                });
              }
            );
            observables.push(observable);
          });
          return Observable.forkJoin(observables)
        })
        this.getPartnersSubscription = markers$.subscribe((markers) => {
          markers.map(marker => this.markerCache[marker.partner.id] = marker);
          this.markers = markers;
          this.markerClusterer.addMarkers(markers);

        })
      });
  }

  clearMarkers() {
    if (this.markerClusterer) {
      this.markerClusterer.clearMarkers();
    }
    this.markers = [];
    /* while (this.markers.length > 0) {
      let markerObj = this.markers.pop();
      markerObj.setMap(null);
      markerObj = null;
    }
    this.markers = [];
    if (this.markerClusterer) {
      this.markerClusterer.clearMarkers();
    } */
  }


  private resizeMap() {
    google.maps.event.trigger(this.map, 'resize');
  }

  unsubscribeFromGetPartnersRequest() {
    if (this.getPartnersSubscription) {
      this.getPartnersSubscription.unsubscribe()
    }
  }

  private setMapOptions(map: any) {
    map.setOptions({clickableIcons: false});
  }


  getRadius(center, ne) {
    let lat1 = center.lat() / 57.2958;
    let lon1 = center.lng() / 57.2958;
    let lat2 = ne.lat() / 57.2958;
    let lon2 = ne.lng() / 57.2958;
    let earthRadius = 3963.0;


    // distance = circle radius from center to Northeast corner of bounds
    let dis = earthRadius * Math.acos(Math.sin(lat1) * Math.sin(lat2) +
        Math.cos(lat1) * Math.cos(lat2) * Math.cos(lon2 - lon1));
    let roundedDis = dis.toFixed(4);
    console.log(roundedDis);
    return roundedDis;
  }

  ngOnDestroy(){
    this.unsubscribeFromGetPartnersRequest();
  }
}

