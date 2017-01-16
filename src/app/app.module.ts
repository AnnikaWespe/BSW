import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';

import { MyApp } from './app.component';
import {OverviewComponent} from '../pages/overview-page-component/overview-component';
import  { AddPurchaseComponent} from '../pages/add-purchase-page-component/add-purchase-component';
import {LoginComponent} from '../pages/login-page-component/login-component';
import {SavingsOverviewComponent} from '../pages/overview-page-component/savings-overview-component/savings-overview-component';
import {PartnersOverviewComponent} from '../pages/overview-page-component/partners-overview-component/partners-overview-component';


@NgModule({
  declarations: [
    MyApp,
    OverviewComponent,
    AddPurchaseComponent,
    LoginComponent,
    SavingsOverviewComponent,
    PartnersOverviewComponent
  ],
  imports: [
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    OverviewComponent,
    AddPurchaseComponent,
    LoginComponent
  ],
  providers: [{provide: ErrorHandler, useClass: IonicErrorHandler}]
})
export class AppModule {}
