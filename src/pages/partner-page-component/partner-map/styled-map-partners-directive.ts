const svg = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="138" height="149.34" viewBox="0 0 138 149.34">
<metadata><?xpacket begin="﻿" id="W5M0MpCehiHzreSzNTczkc9d"?>
<x:xmpmeta xmlns:x="adobe:ns:meta/" x:xmptk="Adobe XMP Core 5.6-c138 79.159824, 2016/09/14-01:09:01        ">
  <rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#">
  <rdf:Description rdf:about=""/>
  </rdf:RDF>
</x:xmpmeta>
<?xpacket end="w"?></metadata>
<defs>
  <style>
.cls-1 {
  fill: #fff;
  fill-rule: evenodd;
  filter: url(#filter);
}
</style>
<filter id="filter" x="4693" y="3827.66" width="138" height="149.34" filterUnits="userSpaceOnUse">
<feOffset result="offset" dx="1.71" dy="4.698" in="SourceAlpha"/>
<feGaussianBlur result="blur" stdDeviation="2.449"/>
<feFlood result="flood" flood-opacity="0.27"/>
<feComposite result="composite" operator="in" in2="blur"/>
<feBlend result="blend" in="SourceGraphic"/>
</filter>
</defs>
<path id="Marker" class="cls-1" d="M4711.01,3827.65h96.31a14.779,14.779,0,0,1,14.82,14.75v73.77a14.788,14.788,0,0,1-14.82,14.76h-37.09l-11.07,35.04-11.84-35.04h-36.31a14.788,14.788,0,0,1-14.82-14.76V3842.4A14.779,14.779,0,0,1,4711.01,3827.65Z" transform="translate(-4693 -3827.66)"/>
    `


import {Directive, Input, Output, EventEmitter, OnChanges} from '@angular/core';
import {GoogleMapsAPIWrapper} from 'angular2-google-maps/core';
import {generate} from "../../Observable";
import {NavController, Platform} from 'ionic-angular';
import {DeviceService} from "../../../services/device-data";
import {PartnerService} from "../../../services/partner-service";
import {PartnerDetailComponent} from "../partner-detail-component/partner-detail-component";
import {Observable} from 'rxjs/Observable'


import 'rxjs/add/observable/of';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/throw';
import 'rxjs/add/observable/forkJoin';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/operator/combineLatest';


declare let google: any;
declare let MarkerClusterer: any;

@Directive({
  selector: 'styled-map-partners',
})
export class StyledMapPartnersDirective {

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
  markerClusterer;
  bucket = 0;
  center;
  radius;

  constructor(private googleMapsWrapper: GoogleMapsAPIWrapper,
              private partnerService: PartnerService,
              private navCtrl: NavController) {
    if (DeviceService.isInBrowser) {
      this.pathToGmapsClusterIcons = '../assets/icon/m';
    }
    //TODO: check path on IOS and WindowsPhone
    else if (DeviceService.isAndroid || DeviceService.isIos || DeviceService.isWindowsPhone) {
      this.pathToGmapsClusterIcons = '../www/assets/icon/m';
    }

    this.googleMapsWrapper.getNativeMap()
      .then((map) => {
        this.map = map;
        this.setMapOptions(map);
        const idle$ = Observable.create((observer) => {
          let timer;
          map.addListener('idle', () => {
            clearTimeout(timer);
            timer = setTimeout(()=>{
              observer.next();
            }, 1500)
          })
        })
        const center$ = idle$.map(() => {
          let newCenter = this.map.getCenter();
          let newLat = this.map.getCenter().lat().toFixed(4);
          let newLong = this.map.getCenter().lng().toFixed(4);
          let center = {latitude: newLat, longitude: newLong};
          let radius = this.getRadius(newCenter, this.map.getBounds().getNorthEast());
          return {center: center, radius: radius};
        })
        const partners$ = center$
          .combineLatest(this.justPartnersWithCampaign$.startWith(this.justPartnersWithCampaign), this.searchTerm$.startWith(this.searchTerm))
          .switchMap((params) => {
            this.center = params[0].center;
            this.radius = params[0].radius;
            let showOnlyPartnersWithCampaign = params[1];
            let searchTerm = params[2];
            console.log(this.center, this.radius, showOnlyPartnersWithCampaign);
            return this.partnerService.getPartners(this.center, this.bucket, searchTerm, showOnlyPartnersWithCampaign, this.radius)
          }).map(body => {
            let returnedObject = body.json();
            let offlinePartners = returnedObject.originalSearchResults.bucketToSearchResult["OFFLINEPARTNER"].contentEntities;
            this.clearMarkers();
            return offlinePartners;
          })
        const markers$ = partners$.switchMap((offlinePartners) => {
          let observables = [];
          if (offlinePartners == undefined) {
            return [];
          }
          offlinePartners.forEach((partner, index) => {
            let observable = Observable.create(observer => {
              this.getImageAsBase64(partner.logoUrlForGMap, (imageAsBase64, validImage) => {
                let bounds = new google.maps.LatLngBounds();
                let marker = this.getMarker(partner, imageAsBase64, validImage, map, bounds);
                this.markers.push(marker);
                google.maps.event.addListener(marker, 'click', (function (marker) {
                  //TODO: navigate to corresponding partner
                  return function () {
                    this.navCtrl.push(PartnerDetailComponent);
                  }
                })(marker));
                observer.next(marker);
                observer.complete();
              });
            });
            observables.push(observable);
          });
          return Observable.forkJoin(observables)
        })
          this.getPartnersSubscription = markers$.subscribe((markers) => {
          this.markers = markers;
          this.markerClusterer = new MarkerClusterer(map, markers,
            {imagePath: this.pathToGmapsClusterIcons});
          google.maps.event.addListener(this.markerClusterer, 'clusterclick', (cluster) => {
            this.fillList.emit(cluster.getMarkers());
            google.maps.event.trigger(map, 'resize');
          });
        })
      });
  }

  clearMarkers() {
    while (this.markers.length > 0) {
      let markerObj = this.markers.pop();
      markerObj.setMap(null);
      markerObj = null;
    }
    this.markers = [];
    if (this.markerClusterer) {
      this.markerClusterer.clearMarkers();
    }
  }

  getPartners() {
    if (this.getPartnersSubscription) {
      this.getPartnersSubscription.unsubscribe();
    }
    this.getPartnersSubscription = this.partnerService.getPartners(this.center, this.bucket, this.searchTerm, null, this.radius)
      .subscribe(
        body => {
          let returnedObject = body.json();
          let offlinePartners = returnedObject.originalSearchResults.bucketToSearchResult["OFFLINEPARTNER"].contentEntities;
          this.placeMarkers(this.map, offlinePartners);
        })
  }


  private placeMarkers(map, partners) {
    let bounds = new google.maps.LatLngBounds();
    let promises = [];
    this.clearMarkers();
    if (partners && this.markers.length === 0) {
      partners.forEach((partner, index) => {
        if (partner && partner.location) {
          promises.push(new Promise((resolve, reject) => {
            this.getImageAsBase64(partner.logoUrlForGMap, (imageAsBase64, validImage) => {
              let marker = this.getMarker(partner, imageAsBase64, validImage, map, bounds);
              this.markers.push(marker);
              google.maps.event.addListener(marker, 'click', (function (marker) {
                return function () {
                  this.navCtrl.push(PartnerDetailComponent);
                }
              })(marker));
              resolve();
            });
          }))
        }
      });
      Promise.all(promises)
        .then(() => {
            this.markerClusterer = new MarkerClusterer(map, this.markers,
              {imagePath: this.pathToGmapsClusterIcons});
            google.maps.event.addListener(this.markerClusterer, 'clusterclick', (cluster) => {
              this.fillList.emit(cluster.getMarkers());
              google.maps.event.trigger(map, 'resize');
            });
          }
        )
    }
  }


  private resizeMap() {
    google.maps.event.trigger(this.map, 'resize');
  }

  unsubscribeFromGetPartnersRequest() {
    if (this.getPartnersSubscription) {
      this.getPartnersSubscription.unsubscribe()
    }
  }


//map styling methods and helper methods


  private setMapOptions(map: any) {
    map.setOptions({clickableIcons: false});
  }

  private getMarker(partner, imageAsBase64, validImage, map, bounds) {
    let latitude = partner.location.latitude;
    let longitude = partner.location.longitude;
    let imageIcon;
    let textIcon;
    if (validImage) {
      imageIcon = 'data:image/svg+xml;utf8,' + svg + '<image x="10" y="-18" width="110" height="110" xlink:href="' + imageAsBase64 + '"/>' + this.bonusElement(partner.pfBonus) + '</svg>';
    }
    else {
      textIcon = 'data:image/svg+xml;utf8,' + svg + this.bonusElement(partner.pfBonus) + this.partnerElement(partner.nameOrigin) + '</svg>';
    }
    let icon = (validImage) ? imageIcon : textIcon;
    let marker = new google.maps.Marker({
      position: new google.maps.LatLng(latitude, longitude),
      map: map,
      icon: icon,
      partner: partner
    });
    bounds.extend({lat: latitude, lng: longitude});
    return marker;
  }

  private getImageAsBase64(imageUrl, callback) {
    if (imageUrl === "https://www.bsw.de/upload/bsw/partner-logo.png") {
      callback("", false)
    }
    else {
      let xhr = new XMLHttpRequest();
      xhr.onload = () => {
        let reader = new FileReader();
        reader.onloadend = () => {
          callback(reader.result, true);
        }
        reader.readAsDataURL(xhr.response);
      };
      xhr.open('GET', imageUrl);
      xhr.responseType = 'blob';
      xhr.send();
    }
  }

  bonusElement(bonusString): string {
    let x;
    let fontSize;
    let stringLength = bonusString.length;
    let generatedString;
    if (stringLength < 4) {
      fontSize = 18;
      x = "52"
    }
    else if (stringLength < 12) {
      fontSize = 18;
      x = "24"
    }
    else {
      fontSize = 14.5;
      x = "5"
    }
    ;
    generatedString = '<text x="' + x + '" y="90" font-family="Helvetica Neue" font-size="' + fontSize + '" fill="#E61B5A">' + bonusString + '</text>';
    return generatedString;
  }

  partnerElement(partnerString) {
    let x;
    let fontSize;
    let stringLength = partnerString.length;
    let generatedString;
    if (stringLength < 11) {
      fontSize = 22;
    }
    else if (stringLength < 16) {
      fontSize = 14;
    }
    else if (stringLength < 22) {
      fontSize = 12
    }
    else {
      fontSize = 10;
    }
    ;
    generatedString = '<text x="3" y="40" font-family="Helvetica Neue" font-size="' + fontSize + '">' + partnerString + '</text>';
    return generatedString;
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

}

