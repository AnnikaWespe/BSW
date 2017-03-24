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
import {LocationData} from "../services/location-data";


@Component({
  templateUrl: 'app.html'
})
export class MyApp implements OnInit{
  @ViewChild(Nav) nav: Nav;

  rootPage: any = LoginPageComponent;
  pages: Array<{title: string, component: any, icon: string, parameters: {}}>;


  constructor(public platform: Platform) {
    this.initializeApp();
    this.setMenu();
  }

  ngOnInit(){
    this.getDevice();
    this.getLocation();

  }

  initializeApp() {
    this.platform.ready().then(() => {
      StatusBar.styleDefault();
      Splashscreen.hide();
    });
  }

  openPage(page) {
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
      console.log("ios");
    }
    else if (this.platform.is('windows')){
      DeviceService.isIos = true;
      console.log("windowsPhone");
    }
  }

  setMenu(){
    this.pages = [
      { title: 'Übersicht', component: OverviewPageComponent, icon: "home", parameters: {} },
      { title: 'Vor Ort Partner', component: PartnerPageComponent, icon: "list", parameters: {activeFilter: "localPartners", title: "Vor Ort Partner", icon: "icon_onlinepartner.png"}},
      { title: 'Online Partner', component: PartnerPageComponent, icon: "sunny", parameters: {activeFilter: "onlinePartners", title: "Online Partner", icon: "icon_vorortpartner.png"}},
      { title: 'Einkauf nachtragen', component: AddPurchasePageComponent, icon: "cash", parameters: {}},
      { title: 'Mein Profil', component: MyProfilePageComponent, icon: "person", parameters: {}},
      { title: 'Einstellungen', component: SettingsPageComponent, icon:"settings", parameters: {}},
      {title: "Abmelden", component: LoginPageComponent, icon: "exit", parameters: {}}]
  }

  getLocation(){

    }

    getLocationName(lat, lon){

    }

}


