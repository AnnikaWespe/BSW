import {NgModule, ErrorHandler} from '@angular/core';
import {IonicApp, IonicModule, IonicErrorHandler, Animation} from 'ionic-angular';
import {FormsModule} from '@angular/forms';
import {HttpModule, JsonpModule} from '@angular/http';
import {BrowserModule} from '@angular/platform-browser';

import {SplashScreen} from '@ionic-native/splash-screen';
import {StatusBar} from '@ionic-native/status-bar';
import {Camera} from '@ionic-native/camera';
import {BarcodeScanner} from '@ionic-native/barcode-scanner';
import {Geolocation} from '@ionic-native/geolocation';

import {AgmCoreModule} from '@agm/core';
//import { GoogleMapsAPIWrapper } from '@agm/core/services/google-maps-api-wrapper';


import {BSWBonusApp} from './app.component';
import {LoginPageComponent} from '../pages/login-page-component/login-component';
import {OverviewPageComponent} from '../pages/overview-page-component/overview-component';
import {AddPurchasePageComponent} from '../pages/add-purchase-page-component/add-purchase-component';
import {ConfirmScanPageComponent} from '../pages/login-page-component/confirm-scan-page-component/confirm-scan-page-component';
import {MyProfilePageComponent} from "../pages/my-profile-page-component/my-profile-page-component";
import {PartnerPageComponent} from "../pages/partner-page-component/partner-page-component";
import {SettingsPageComponent} from "../pages/settings-page-component/settings-page-component";
import {PartnerService} from '../services/partner-service';
import {TruncatePipe, DynamicTruncatePipe} from '../pages/partner-page-component/truncate'
import {ChooseLocationManuallyComponent} from "../pages/partner-page-component/choose-location-manually/choose-location-manually-component";
import {SearchCompletionService} from "../components/searchHeader/search-completion/search-completion-service.ts";
import {StyledMapChooseManually} from "../pages/partner-page-component/choose-location-manually/styledMapChooseManually";
import {PartnerDetailComponent} from "../pages/partner-page-component/partner-detail-component/partner-detail-component";
import {PartnerDetailMap} from "../pages/partner-page-component/partner-detail-component/partner-detail-map/partner-detail-map";
import {PartnerMapComponent} from "../pages/partner-page-component/partner-map/partner-map";
import {PartnerTableComponent} from "../components/partner-table/partner-table";
import {StyledMapPartnerDetailsDirective} from "../pages/partner-page-component/partner-detail-component/partner-detail-map/styled-map-partner-details-directive";
import {PictureScreenComponent} from "../pages/add-purchase-page-component/picture-screen/picture-screen";
import {StyledMapPartnersDirective} from "../pages/partner-page-component/partner-map/styled-map-partners-directive";
import {TypeaheadComponent} from "../components/searchHeader/typeahead/typeahead";
import {SafePipe} from "../pipes/safe-pipe";
import {LocationService} from "../services/location-service";
import {LoginWebviewComponent} from "../pages/login-page-component/login-webview/login-webview";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {WebviewComponent} from "../pages/webview/webview";
import {LoginService} from "../pages/login-page-component/login-service";
import {FavoritesService} from "../services/favorites-service";
import {EnvironmentService} from "../services/environment-service";
import {UserSpecificPartnersComponent} from "../pages/overview-page-component/user-specific-partners-page-component/user-specific-partners-component";
import {MapMarkerService} from "../services/map-marker-service";
import {GoogleAnalytics} from "@ionic-native/google-analytics";
import {ChangePasswordModal} from "../pages/my-profile-page-component/ChangePassword/change-password-modal";
import {ChangePasswordService} from "../pages/my-profile-page-component/ChangePassword/changePasswordService";
import {PartnerDetailService} from "../pages/partner-page-component/partner-detail-component/partner-detail-map/partner-detail-service";
import {BonusService} from "../pages/overview-page-component/bonus-service";
import {InitService} from "./init-service";
import {SavePartnersService} from "../pages/partner-page-component/partner-detail-component/save-partners-service";
import {PartnerTableCachedComponent} from "../pages/overview-page-component/partner-table-cached/partner-table-cached";
import {NativeGeocoder} from "@ionic-native/native-geocoder";
import {PushNotificationsService} from "../services/push-notifications-service";
import {Firebase} from "@ionic-native/firebase";
import {FormatTelephoneNumberPipe} from "../pages/partner-page-component/partner-detail-component/format.pipe";
import {PushesListPageComponent} from "../pages/pushes-list/pushes-list";


@NgModule({
  declarations: [
    BSWBonusApp,
    OverviewPageComponent,
    AddPurchasePageComponent,
    LoginPageComponent,
    ConfirmScanPageComponent,
    MyProfilePageComponent,
    PartnerPageComponent,
    SettingsPageComponent,
    ChooseLocationManuallyComponent,
    DynamicTruncatePipe,
    FormatTelephoneNumberPipe,
    TruncatePipe,
    StyledMapChooseManually,
    PartnerDetailComponent,
    PartnerDetailMap,
    StyledMapPartnerDetailsDirective,
    StyledMapPartnersDirective,
    PartnerMapComponent,
    PartnerTableComponent,
    PictureScreenComponent,
    TypeaheadComponent,
    WebviewComponent,
    SafePipe,
    UserSpecificPartnersComponent,
    ChangePasswordModal,
    PartnerTableCachedComponent,
    PushesListPageComponent,
  ],
  imports: [
    IonicModule.forRoot(BSWBonusApp, {
      "platforms": {
        "ios": {
          "backButtonText": "Zurück",
          "backButtonColor": "grey"
        },
        "android": {
          "backButtonText": "",
          "backButtonColor": "grey",
          "backButtonIcon": "arrow-back"
        }
      }
    }),
    BrowserModule,
    FormsModule,
    HttpModule,
    JsonpModule,
    BrowserAnimationsModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyBAHcgksDNzLfzvKC0ZjnoQZeivSQbE1Iw'
    }),
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    BSWBonusApp,
    OverviewPageComponent,
    AddPurchasePageComponent,
    LoginPageComponent,
    ConfirmScanPageComponent,
    MyProfilePageComponent,
    PartnerPageComponent,
    SettingsPageComponent,
    ChooseLocationManuallyComponent,
    PartnerDetailComponent,
    PartnerDetailMap,
    PartnerMapComponent,
    PartnerTableComponent,
    PictureScreenComponent,
    TypeaheadComponent,
    WebviewComponent,
    UserSpecificPartnersComponent,
    PartnerTableCachedComponent,
    ChangePasswordModal,
    PushesListPageComponent,
  ],
  providers: [
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    SplashScreen,
    StatusBar,
    Camera,
    BarcodeScanner,
    Geolocation,
    LocationService,
    EnvironmentService,
    PartnerService,
    SearchCompletionService,
    LoginService,
    FavoritesService,
    MapMarkerService,
    ChangePasswordService,
    PartnerDetailService,
    SavePartnersService,
    BonusService,
    InitService,
    PushNotificationsService,
    //GoogleMapsAPIWrapper,
    GoogleAnalytics,
    NativeGeocoder,
    Firebase
  ]
})
export class AppModule {
}
