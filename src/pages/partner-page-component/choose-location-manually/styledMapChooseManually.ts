import { Directive } from '@angular/core';
import { GoogleMapsAPIWrapper } from '@agm/core/services/google-maps-api-wrapper';

@Directive({
  selector: 'styled-map'
})

export class StyledMapChooseManually {

  constructor(private _wrapper: GoogleMapsAPIWrapper) {

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

      m.setOptions({
        streetViewControl: false,
        //styles: stylesArray
      });
      console.log("native Map found");
    });
  }
}
