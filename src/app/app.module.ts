import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import {FormsModule} from '@angular/forms';
import {HttpModule, JsonpModule} from '@angular/http';
import { AgmCoreModule } from 'angular2-google-maps/core';

import { MyApp } from './app.component';
import {LoginPageComponent} from '../pages/login-page-component/login-component';
import {OverviewPageComponent} from '../pages/overview-page-component/overview-component';
import  { AddPurchasePageComponent} from '../pages/add-purchase-page-component/add-purchase-component';
import {SavingsOverviewComponent} from '../pages/overview-page-component/savings-overview-component/savings-overview-component';
import {PartnersOverviewComponent} from '../pages/overview-page-component/partners-overview-component/partners-overview-component';
import {ConfirmScanPageComponent} from '../pages/login-page-component/confirm-scan-page-component/confirm-scan-page-component';
import {ActionsPageComponent} from "../pages/actions-page-component/actions-page-component";
import {LogoutPageComponent} from "../pages/logout-page-component/logout-page-component";
import {MyProfilePageComponent} from "../pages/my-profile-page-component/my-profile-page-component";
import {PartnerPageComponent} from "../pages/partner-page-component/partner-page-component";
import {SettingsPageComponent} from "../pages/settings-page-component/settings-page-component";
import {MembershipDataFormComponent} from "../pages/my-profile-page-component/user-detail/membership-data-form.component";
import {PartnerService} from '../pages/partner-page-component/partner-service';
import {TruncateWordsPipe} from '../pages/partner-page-component/truncate'
import {ChooseLocationManuallyComponent} from "../pages/partner-page-component/choose-location-manually/choose-location-manually";
import {SearchCompletionService} from "../pages/partner-page-component/search-completion/search-completion-service";


@NgModule({
  declarations: [
    MyApp,
    OverviewPageComponent,
    AddPurchasePageComponent,
    LoginPageComponent,
    SavingsOverviewComponent,
    PartnersOverviewComponent,
    ConfirmScanPageComponent,
    ActionsPageComponent,
    LogoutPageComponent,
    MyProfilePageComponent,
    PartnerPageComponent,
    SettingsPageComponent,
    MembershipDataFormComponent,
    ChooseLocationManuallyComponent,
    TruncateWordsPipe,
  ],
  imports: [
    IonicModule.forRoot(MyApp),
    FormsModule,
    HttpModule,
    JsonpModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyBAHcgksDNzLfzvKC0ZjnoQZeivSQbE1Iw'
    })
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    OverviewPageComponent,
    AddPurchasePageComponent,
    LoginPageComponent,
    ConfirmScanPageComponent,
    ActionsPageComponent,
    LogoutPageComponent,
    MyProfilePageComponent,
    PartnerPageComponent,
    SettingsPageComponent,
    ChooseLocationManuallyComponent
  ],
  providers: [{provide: ErrorHandler, useClass: IonicErrorHandler}, PartnerService, SearchCompletionService],

})
export class AppModule {}
