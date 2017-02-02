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
  mode = "Observable";

  showDropdown: boolean[] = [false, false];

  errorMessage: string;
  returnedObject: any;
  partnersJson: any;
  location: {latitude: number, longitude: number};

  partners: any;
  offlinePartners: any;
  onlinePartners: any;
  travelPartners: any;
  vehiclePartners: any;
  displayedPartners: any;

  numberOfOfflinePartners: number;
  numberOfOnlinePartners: number;
  numberOfTravelPartners: number;
  numberOfVehiclePartners: number;
  numberOfPartnersTotal: number;

  numberOfPagesTotal: number;
  numberOfPagesOffline: number;
  numberOfPagesOnline: number;
  numberOfPagesTravel: number;
  numberOfPagesVehicle: number;




  constructor(public navCtrl: NavController, public navParams: NavParams, private partnerService: PartnerService) {
  }

  ngOnInit() {
    this.getLocationData();
  };

  getLocationData() {
    Geolocation.getCurrentPosition().then((position) => {
      this.location = position.coords;
      this.getPartners(this.location);
    }, (err) => {
      console.log(err);
    })
  }

  getPartners(location) {
    this.partnerService.getPartners(location)
      .subscribe(
        body => {
          this.returnedObject = body.json();
          this.partnersJson = body;
          this.partners = this.returnedObject.contentEntities;
          this.displayedPartners = this.partners;

          this.onlinePartners = this.returnedObject.originalSearchResults.bucketToSearchResult.ONLINEPARTNER.contentEntities;
          this.offlinePartners = this.returnedObject.originalSearchResults.bucketToSearchResult.OFFLINEPARTNER.contentEntities;
          this.travelPartners = this.returnedObject.originalSearchResults.bucketToSearchResult.TRAVELOFFER.contentEntities;
          this.vehiclePartners = this.returnedObject.originalSearchResults.bucketToSearchResult.VEHICLEOFFER.contentEntities;
        },
        error => this.errorMessage = <any>error);

  }

  toggleVisibility(position) {
    let isVisible = this.showDropdown[position];
    this.showDropdown = [false, false];
    this.showDropdown[position] = !isVisible;
  }

  display(partnerType){
    this.displayedPartners = this[partnerType];
    this.toggleVisibility(0);
  }

}




