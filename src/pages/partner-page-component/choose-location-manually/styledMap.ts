import { Directive } from '@angular/core';
import { GoogleMapsAPIWrapper } from 'angular2-google-maps/core';

@Directive({
  selector: 'styled-map'
})

export class StyledMap {

  constructor(private _wrapper: GoogleMapsAPIWrapper) {

    this._wrapper.getNativeMap().then((m) => {


      let stylesArray : any = [
        {
             clickableIcons: false 
        }
      ];

      m.setOptions({
        streetViewControl: false,
        styles: stylesArray
      });
      console.log("native Map found");
    });
  }
}
