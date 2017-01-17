import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';

import { MyApp } from './app.component';
import {LoginPageComponent} from '../pages/login-page-component/login-component';
import {OverviewPageComponent} from '../pages/overview-page-component/overview-component';
import  { AddPurchasePageComponent} from '../pages/add-purchase-page-component/add-purchase-component';
import {SavingsOverviewComponent} from '../pages/overview-page-component/savings-overview-component/savings-overview-component';
import {PartnersOverviewComponent} from '../pages/overview-page-component/partners-overview-component/partners-overview-component';
import {ScanNumberPageComponent} from '../pages/login-page-component/scan-number-page-component/scan-number-page-component'


@NgModule({
  declarations: [
    MyApp,
    OverviewPageComponent,
    AddPurchasePageComponent,
    LoginPageComponent,
    SavingsOverviewComponent,
    PartnersOverviewComponent,
    ScanNumberPageComponent
  ],
  imports: [
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    OverviewPageComponent,
    AddPurchasePageComponent,
    LoginPageComponent,
    ScanNumberPageComponent
  ],
  providers: [{provide: ErrorHandler, useClass: IonicErrorHandler}]
})
export class AppModule {}
