import {Component, OnInit, ViewChild} from '@angular/core';
import {NavController, NavParams} from 'ionic-angular';
import {Geolocation} from 'ionic-native';
import {PartnerService} from "./partner-service";
import {ChooseLocationManuallyComponent} from "./choose-location-manually/choose-location-manually";


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

  location: {latitude: number, longitude: number};
  locationFound: boolean = false;

  partners: any[] = [];
  displayedPartners: any[] = [];

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
      this.locationFound = true;
      this.getPartners(this.location);
    }, (err) => {
      console.log(err);
      this.getPartners(this.location);
    })
  }

  getPartners(location) {
    this.partnerService.getPartners(location, this.bucket)
      .subscribe(
        body => {
          let returnedObject = body.json();
          if(this.category == "allpartners"){
            this.displayedPartners = this.displayedPartners.concat(returnedObject.contentEntities);
          }
          else{
            this.displayedPartners = this.displayedPartners.concat(returnedObject.originalSearchResults.bucketToSearchResult[this.category].contentEntities);
          };
          this.waitingForResults = false;
          console.log(this.displayedPartners);
        },
        error => this.errorMessage = <any>error);

  }

  toggleVisibility(position) {
    let isVisible = this.showDropdown[position];
    this.showDropdown = [false, false];
    this.showDropdown[position] = !isVisible;
  }

  filter(partnerType){
      if(this.locationFound){
        this.category = partnerType;
        this.displayedPartners = [];
        this.getPartners(this.location);
        this.hideDropdown();
        this.waitingForResults = true;
      }
  }

  doInfinite(infiniteScroll){
    console.log("loadnextpartners");
    this.bucket += 1;
    this.getPartners(this.location);
    infiniteScroll.complete();
  }

  chooseLocationManually(){
    event.stopPropagation();
    this.navCtrl.push(ChooseLocationManuallyComponent);
    this.hideDropdown();
  }

  hideDropdown(){
    this.showDropdown = [false, false];
  }
}





