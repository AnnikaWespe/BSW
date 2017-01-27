import {Component, OnInit} from '@angular/core';
import {NavController, NavParams} from 'ionic-angular';
import {Geolocation} from 'ionic-native';
import {PartnerService} from "./partner-service";


@Component({
  selector: 'partner-page-component',
  templateUrl: 'partner-page-component.html'
})
export class PartnerPageComponent implements OnInit {
  title: string = "Partner";
  errorMessage: string;
  partners: {};
  mode = "Observable";
  location: {latitude: number, longitude: number};

  constructor(public navCtrl: NavController, public navParams: NavParams, private partnerService: PartnerService) {
  }

  ngOnInit() {
    this.getLocationData();
  };

  getLocationData() {
    return new Promise((resolve, reject) => {
      Geolocation.getCurrentPosition({timeout: 20000, enableHighAccuracy: false})
        .then((position) => {
          this.location = position.coords;
          this.getPartners(this.location);
        })
        .catch(
          (err) => {
            console.error('Could not read current location');
            console.log(err.code + err.message);
            reject(err);
          });
    })
  }

  getPartners(location) {
    this.partnerService.getPartners(location)
      .subscribe(
        partners => this.partners = partners,
        error => this.errorMessage = <any>error);
  }
}




