import {Component, OnInit} from '@angular/core';
import {NavController, NavParams} from 'ionic-angular';
import {Geolocation} from 'ionic-native';
import {PartnerService} from "./partner-service";


@Component({
  selector: 'partner-page-component',
  templateUrl: 'partner-page-component.html',
})
export class PartnerPageComponent implements OnInit {
  title: string = "Partner";
  errorMessage: string;
  returnedObject: any;
  partnersJson: any;
  partners: any;
  mode = "Observable";
  location: {latitude: number, longitude: number};
  constructor(public navCtrl: NavController, public navParams: NavParams, private partnerService: PartnerService) {
  }

  ngOnInit() {
    this.getLocationData();
  };

  /*x(){
    Geolocation.getCurrentPosition().then((position) => {
      this.location = position.coords;
      this.getPartners(this.location);
    }, (err) => {
      console.log(err);
    })
  }*/


  getLocationData() {
    return new Promise((resolve, reject) => {
      Geolocation.getCurrentPosition({timeout: 20000, enableHighAccuracy: false})
        .then((position) => {
          this.location = position.coords;
          this.getPartners(this.location);
          resolve();
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
        body => {this.returnedObject = body.json();
          this.partnersJson = body;
          this.partners = this.returnedObject.contentEntities;
          console.log("partners: " + this.partners);
          console.log("error: " + this.errorMessage);
          this.processData();
        },
        error => this.errorMessage = <any>error);

  }

  processData(){

  }
}




