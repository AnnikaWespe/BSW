import {OnInit, Directive, Input, OnChanges} from '@angular/core';
import {GoogleMapsAPIWrapper} from 'angular2-google-maps/core';
import {generate} from "../../Observable";
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
    `

const svgCluster = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="173" height="92" viewBox="0 0 173 92">
  <metadata><?xpacket begin="﻿" id="W5M0MpCehiHzreSzNTczkc9d"?>
<x:xmpmeta xmlns:x="adobe:ns:meta/" x:xmptk="Adobe XMP Core 5.6-c138 79.159824, 2016/09/14-01:09:01        ">
   <rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#">
      <rdf:Description rdf:about=""/>
   </rdf:RDF>
</x:xmpmeta>                                                                           
<?xpacket end="w"?></metadata>
<image id="Ellipse_560_Kopie" data-name="Ellipse 560 Kopie" width="173" height="92" xlink:href="data:img/png;base64,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"/>
</svg>
`




@Directive({
  selector: 'styled-map-partners',
})
export class StyledMapPartnersDirective implements OnChanges, OnInit{

  @Input() partners: any[];

  clustersArray = [];
  indexesOfClusteredItemsArray =[];
  partnersInClusters = {};

  ngOnInit(){
    console.log(this.partners);
  }


  clusterPartnersWithDuplicatePositions(){
    this.resetParameters();
    this.searchForDoubles();
    this.modifyPartnersArray();
  }

  resetParameters(){
    this.clustersArray = [];
    this.indexesOfClusteredItemsArray =[];
    this.partnersInClusters = {};
  }

  searchForDoubles(){
    this.partners.map((partner, indexOrigin) =>
    {
      if (this.indexesOfClusteredItemsArray.indexOf(indexOrigin) === -1){
        let originLat = partner.location.latitude;
        let originLon = partner.location.longitude;
        let duplicatesOfThisPartner = [indexOrigin];
        this.partners.forEach((partnerToCheck, index) => {
          if (this.indexesOfClusteredItemsArray.indexOf(index) === -1 && index !== indexOrigin && partnerToCheck.location.longitude === originLon && partnerToCheck.location.latitude === originLat){
            duplicatesOfThisPartner.push(index);
            this.indexesOfClusteredItemsArray.push(index);
            if (this.indexesOfClusteredItemsArray.indexOf(indexOrigin) === -1){
              this.indexesOfClusteredItemsArray.push(indexOrigin);
            }
          };

        });
        if(duplicatesOfThisPartner.length > 1){
          this.clustersArray.push(duplicatesOfThisPartner);
          console.log(duplicatesOfThisPartner);
        }
      }
    });
  }

  modifyPartnersArray(){
    this.indexesOfClusteredItemsArray = this.indexesOfClusteredItemsArray.sort(function(a, b){ return b - a; });
    console.log(this.indexesOfClusteredItemsArray);
    console.log(this.clustersArray);
    for (let index of this.indexesOfClusteredItemsArray){
      this.partnersInClusters[index] = this.partners[index];
      this.partners.splice(index, 1);
    };
    console.log(this.partnersInClusters);
    for (let array of this.clustersArray){
      let clusterPartnerArray = [];
      for (let item of array){
        clusterPartnerArray.push(this.partnersInClusters[item]);
      }
    };
  }

  constructor(private googleMapsWrapper: GoogleMapsAPIWrapper) {
  }

  ngOnChanges(){
    console.log(this.partners);
    this.clusterPartnersWithDuplicatePositions();
    this.googleMapsWrapper.getNativeMap()
      .then((map) => {
        this.setMapOptions(map);
        this.placeMarkers(map);
      });
  }


  private setMapOptions(map: any) {
    map.setOptions({clickableIcons: false});
  }

  bonusElement(bonusString): string{
    let x;
    let fontSize;
    let stringLength = bonusString.length;
    let generatedString;
    if(stringLength < 4){
      fontSize = 18;
      x = "52"
    }
    else if (stringLength < 12){
      fontSize = 18;
      x = "24"
    }
    else{
      fontSize = 14.5;
      x = "5"
    };
    generatedString = '<text x="' + x + '" y="90" font-family="Helvetica Neue" font-size="' + fontSize + '" fill="#E61B5A">' + bonusString + '</text>';
    return generatedString;
  }

  partnerElement(partnerString){
    let x;
    let fontSize;
    let stringLength = partnerString.length;
    let generatedString;
    if(stringLength < 11){
      fontSize = 22;
    }
    else if (stringLength < 16){
      fontSize = 14;
    }
    else if (stringLength < 22){
      fontSize = 12
    }
    else{
      fontSize = 10;
    };
    generatedString = '<text x="3" y="40" font-family="Helvetica Neue" font-size="' + fontSize + '">' + partnerString + '</text>';
    return generatedString;
  }


  private placeMarkers(map) {
    let markers = [];
    let bounds = new google.maps.LatLngBounds();
    let markerClusterer;
    let promises = [];
    this.partners.forEach((partner) => {
      promises.push(new Promise((resolve, reject) => {
        this.getImageAsBase64(partner.logoUrlForGMap, (imageAsBase64, validImage) => {
          let latitude = partner.location.latitude;
          let longitude = partner.location.longitude;
          let imageIcon;
          let textIcon;
          if (validImage){imageIcon = 'data:image/svg+xml;utf8,' + svg + '<image x="10" y="-18" width="110" height="110" xlink:href=' +  '"' + imageAsBase64 + '"/>' + this.bonusElement(partner.pfBonus)  + '</svg>';}
          else {textIcon = 'data:image/svg+xml;utf8,' + svg  + this.bonusElement(partner.pfBonus) + this.partnerElement(partner.nameOrigin) + '</svg>';}
          let icon = (validImage)? imageIcon : textIcon;
          let marker = new google.maps.Marker({
            position: new google.maps.LatLng(latitude, longitude),
            map: map,
            icon: icon
          });
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
    if(imageUrl === "https://www.bsw.de/upload/bsw/partner-logo.png"){
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
}



