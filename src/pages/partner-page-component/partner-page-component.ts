import { Component, OnInit } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import {Geolocation} from 'ionic-native';


@Component({
  selector: 'partner-page-component',
  templateUrl: 'partner-page-component.html'
})
export class PartnerPageComponent implements OnInit{
  title: string = "Partner";
  location:{};
  constructor(public navCtrl: NavController, public navParams: NavParams) {}
  ngOnInit(){
    Geolocation.getCurrentPosition().then((position) => {
      this.location = position.coords;
    })
  }
}
