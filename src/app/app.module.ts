import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import {FormsModule} from '@angular/forms';
import {HttpModule, JsonpModule} from '@angular/http';
import { AgmCoreModule } from 'angular2-google-maps/core';

import { MyApp } from './app.component';
import {LoginPageComponent} from '../pages/login-page-component/login-component';
import {OverviewPageComponent} from '../pages/overview-page-component/overview-component';
import  { AddPurchasePageComponent} from '../pages/add-purchase-page-component/add-purchase-component';
import {ConfirmScanPageComponent} from '../pages/login-page-component/confirm-scan-page-component/confirm-scan-page-component';
import {LogoutPageComponent} from "../pages/logout-page-component/logout-page-component";
import {MyProfilePageComponent} from "../pages/my-profile-page-component/my-profile-page-component";
import {PartnerPageComponent} from "../pages/partner-page-component/partner-page-component";
import {SettingsPageComponent} from "../pages/settings-page-component/settings-page-component";
import {MembershipDataFormComponent} from "../pages/my-profile-page-component/user-detail/membership-data-form.component";
import {PartnerService} from '../services/partner-service';
import {TruncatePipe, DynamicTruncatePipe} from '../pages/partner-page-component/truncate'
import {ChooseLocationManuallyComponent} from "../pages/partner-page-component/choose-location-manually/choose-location-manually-component";
import {SearchCompletionService} from "../components/searchHeader/search-completion/search-completion-service.ts";
import {GoogleMapsAPIWrapper} from "angular2-google-maps/core";
import {StyledMapChooseManually} from "../pages/partner-page-component/choose-location-manually/styledMapChooseManually";
import {PartnerDetailComponent} from "../pages/partner-page-component/partner-detail-component/partner-detail-component";
import {PartnerDetailMap} from "../pages/partner-page-component/partner-detail-component/partner-detail-map/partner-detail-map";
import {PartnerMapComponent} from "../pages/partner-page-component/partner-map/partner-map";
import {PartnerTableComponent} from "../components/partner-table/partner-table";
import {StyledMapPartnerDetailsDirective} from "../pages/partner-page-component/partner-detail-component/partner-detail-map/styled-map-partner-details-directive";
import {PictureScreenComponent} from "../pages/add-purchase-page-component/picture-screen/picture-screen";
import {StyledMapPartnersDirective} from "../pages/partner-page-component/partner-map/styled-map-partners-directive";
import {TypeaheadComponent} from "../components/searchHeader/typeahead/typeahead";
import {UserDetailWebviewComponent} from "../pages/my-profile-page-component/user-detail-webview/user-detail-webview";
import {SafePipe} from "../pipes/safe-pipe";
import {LocationService} from "../services/location-service";


@NgModule({
  declarations: [
    MyApp,
    OverviewPageComponent,
    AddPurchasePageComponent,
    LoginPageComponent,
    ConfirmScanPageComponent,
    LogoutPageComponent,
    MyProfilePageComponent,
    PartnerPageComponent,
    SettingsPageComponent,
    MembershipDataFormComponent,
    ChooseLocationManuallyComponent,
    DynamicTruncatePipe,
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
    UserDetailWebviewComponent,
    SafePipe
  ],
  imports: [
    IonicModule.forRoot(MyApp),
    FormsModule,
    HttpModule,
    JsonpModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyBAHcgksDNzLfzvKC0ZjnoQZeivSQbE1Iw'
    }),
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    OverviewPageComponent,
    AddPurchasePageComponent,
    LoginPageComponent,
    ConfirmScanPageComponent,
    LogoutPageComponent,
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
    UserDetailWebviewComponent
  ],
  providers: [{provide: ErrorHandler, useClass: IonicErrorHandler}, PartnerService, LocationService, SearchCompletionService, GoogleMapsAPIWrapper],

})
export class AppModule {}
