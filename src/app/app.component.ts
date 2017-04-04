import {Component, ViewChild, OnInit} from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar, Splashscreen } from 'ionic-native';


import  {AddPurchasePageComponent} from '../pages/add-purchase-page-component/add-purchase-component';
import {OverviewPageComponent} from "../pages/overview-page-component/overview-component";
import {LoginPageComponent} from "../pages/login-page-component/login-component";
import {MyProfilePageComponent} from "../pages/my-profile-page-component/my-profile-page-component";
import {PartnerPageComponent} from "../pages/partner-page-component/partner-page-component";
import {SettingsPageComponent} from "../pages/settings-page-component/settings-page-component";
import {DeviceService} from "../services/device-data";
import {LocationService} from "../services/location-service";
import {FilterData} from "../services/filter-data";


@Component({
  templateUrl: 'app.html'
})
export class MyApp implements OnInit{
  @ViewChild(Nav) nav: Nav;

  rootPage: any = LoginPageComponent;
  pages: Array<{title: string, component: any, parameters: {}}>;


  constructor(public platform: Platform, private locationService: LocationService) {
    this.initializeApp();
    this.setMenu();
  }

  ngOnInit(){
    this.getDevice();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      StatusBar.styleDefault();
      Splashscreen.hide();
    });
  }

  openPage(page) {
    if(page.filterData){
      FilterData.showOnlinePartners = false;
      FilterData.showLocalPartners = false;
      FilterData.showOnlyPartnersWithCampaign = false;
      FilterData[page.filterData.activeFilter] = true;
      FilterData.title = page.filterData.title;
    }
    this.nav.setRoot(page.component, page.parameters);
  }

  getDevice(){
    if (!this.platform.is('cordova')){
      DeviceService.isInBrowser = true;
      console.log("isInBrowser");
    }
    else if (this.platform.is('ios')){
      DeviceService.isIos = true;
      console.log("ios");
    }
    else if (this.platform.is('android')){
      DeviceService.isAndroid = true;
      console.log("android");
    }
    else if (this.platform.is('windows')){
      DeviceService.isIos = true;
      console.log("windowsPhone");
    }
  }

  setMenu(){
    this.pages = [
      { title: 'Übersicht', component: OverviewPageComponent, parameters: {}},
      { title: 'Vor Ort Partner', component: PartnerPageComponent, parameters: {type: "onlinePartnerPageComponent"}},
      { title: 'Online Partner', component: PartnerPageComponent, parameters: {type: "offlinePartnerPageComponent"}},
      { title: 'Einkauf nachtragen', component: AddPurchasePageComponent, parameters: {}},
      { title: 'Mein Profil', component: MyProfilePageComponent, parameters: {}},
      { title: 'Einstellungen', component: SettingsPageComponent, parameters: {}},
      {title: "Abmelden", component: LoginPageComponent, parameters: {}}]
  }

}


