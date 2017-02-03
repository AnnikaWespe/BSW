import {Component, OnInit} from '@angular/core';
import {NavController, NavParams} from 'ionic-angular';
import {Geolocation} from 'ionic-native';
import {PartnerService} from "./partner-service";


@Component({
  selector: 'partner-page-component',
  templateUrl: 'partner-page-component.html',
})
export class PartnerPageComponent implements OnInit{
  title: string = "Partner";
  mode = "Observable";

  showDropdown: boolean[] = [false, false];
  waitingForResults: boolean = true;

  errorMessage: string;
  returnedObject: any;
  location: {latitude: number, longitude: number};

  partners: any[] = [];
  allpartners: any;
  offlinePartners: any;
  onlinePartners: any;
  travelPartners: any;
  vehiclePartners: any;
  displayedPartners: any = this.allpartners;

  category: string = "allpartners";
  bucket: number = 0;

  statusText: string;

  constructor(public navCtrl: NavController, public navParams: NavParams, private partnerService: PartnerService) {
  }




  ngOnInit() {
    this.getLocationData();
  };


  getLocationData() {
    Geolocation.getCurrentPosition().then((position) => {
      this.location = position.coords;
      this.getPartners(this.location, "allpartners");
    }, (err) => {
      console.log(err);
    })
  }

  getPartners(location) {
    this.partnerService.getPartners(location, this.bucket)
      .subscribe(
        body => {
          this.returnedObject = body.json();
          if(this.category == "allpartners"){

          }
          else
          this.partners = this.partners.concat(this.returnedObject.contentEntities);
          this.waitingForResults = false;

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

  doInfinite(infiniteScroll){
    console.log("loadnextpartners");
    this.bucket += 1;
    this.getPartners(this.location);
    infiniteScroll.complete();
  }
}






