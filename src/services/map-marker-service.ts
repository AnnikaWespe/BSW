

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

declare let google: any;


import {Injectable} from "@angular/core";
@Injectable()
export class MapMarkerService {
  public getMarker(partner, imageAsBase64, validImage, map, bounds) {
    let latitude = partner.location.latitude;
    let longitude = partner.location.longitude;
    let imageIcon;
    let textIcon;
    if (validImage) {
      // xlink : href = ""
      imageIcon = 'data:image/svg+xml;utf8,' + svg + '<image  x="10" y="-18" width="110" height="110" xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="' + imageAsBase64 + '" />' + this.bonusElement(partner.pfBonus) + '</svg>';
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


  public getImageAsBase64(originPage, imageUrl, callback) {
    if (imageUrl === "https://www.bsw.de/upload/bsw/partner-logo.png" && originPage === "StyledMapPartnersDirective") {
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

  public partnerElement(partnerString) {
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
    generatedString = '<text x="3" y="40" font-family="Helvetica Neue" font-size="' + fontSize + '">' + partnerString + '</text>';
    return generatedString;
  }
}
