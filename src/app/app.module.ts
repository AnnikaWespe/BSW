import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';

import { MyApp } from './app.component';
import {LoginPageComponent} from '../pages/login-page-component/login-component';
import {OverviewPageComponent} from '../pages/overview-page-component/overview-component';
import  { AddPurchasePageComponent} from '../pages/add-purchase-page-component/add-purchase-component';
import {SavingsOverviewComponent} from '../pages/overview-page-component/savings-overview-component/savings-overview-component';
import {PartnersOverviewComponent} from '../pages/overview-page-component/partners-overview-component/partners-overview-component';
import {ConfirmScanPageComponent} from '../pages/login-page-component/confirm-scan-page-component/confirm-scan-page-component';
import {ScannerPageComponent} from '../pages/login-page-component/scanner-page-component/scanner-page-component';


@NgModule({
  declarations: [
    MyApp,
    OverviewPageComponent,
    AddPurchasePageComponent,
    LoginPageComponent,
    SavingsOverviewComponent,
    PartnersOverviewComponent,
    ConfirmScanPageComponent,
    ScannerPageComponent
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
    ConfirmScanPageComponent,
    ScannerPageComponent
  ],
  providers: [{provide: ErrorHandler, useClass: IonicErrorHandler}]
})
export class AppModule {}
