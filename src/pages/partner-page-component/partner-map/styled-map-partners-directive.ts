import {OnInit, Directive, Input} from '@angular/core';
import {GoogleMapsAPIWrapper} from 'angular2-google-maps/core';
declare let google: any;
declare let MarkerClusterer: any;


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
    <image x="0" y="0" width="5" height="5" xlink:href=`


@Directive({
  selector: 'styled-map-partners',
})
export class StyledMapPartnersDirective implements OnInit {

  @Input() partners: any[];

  constructor(private googleMapsWrapper: GoogleMapsAPIWrapper) {
  }

  ngOnInit() {
    this.googleMapsWrapper.getNativeMap()
      .then((map) => {
        this.setMapOptions(map);
        this.placeMarkers(map);
      });
  }

  private setMapOptions(map: any) {
    map.setOptions({clickableIcons: false});
  }


  private placeMarkers(map) {
    let markers = [];
    let bounds = new google.maps.LatLngBounds();
    let markerClusterer;
    let promises = [];
    this.partners.forEach((partner) => {
      promises.push(new Promise((resolve, reject) => {
        this.getImageAsBase64(partner.logoUrlForGMap, (imageAsBase64) => {
          let latitude = partner.location.latitude;
          let longitude = partner.location.longitude;
          let marker = new google.maps.Marker({
            position: new google.maps.LatLng(latitude, longitude),
            map: map,
            icon: 'data:image/svg+xml;utf8,' + svg + imageAsBase64 + '/></svg>'
          });
          console.log(marker.icon);
          markers.push(marker);
          google.maps.event.addListener(marker, 'click', (function (marker) {
            return function () {
            }
          })(marker));
          bounds.extend({lat: latitude, lng: longitude});
          resolve();
        });
      }))
    });
    Promise.all(promises)
      .then(() => {
          map.fitBounds(bounds);
          markerClusterer = new MarkerClusterer(map, markers,
            {imagePath: '../assets/icon/m'});
        }
      )
  }

  private getImageAsBase64(imageUrl, callback) {
    let xhr = new XMLHttpRequest();
    xhr.onload = () => {
      let reader = new FileReader();
      reader.onloadend = () => {
        callback(reader.result);
      }
      reader.readAsDataURL(xhr.response);
    };
    xhr.open('GET', imageUrl);
    xhr.responseType = 'blob';
    xhr.send();
  }

}



