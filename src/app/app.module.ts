import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';

import { MyApp } from './app.component';
import {OverviewComponent} from '../pages/overview-component/overview-component';
import  { AddPurchaseComponent} from '../pages/add-purchase-component/add-purchase-component';


@NgModule({
  declarations: [
    MyApp,
    OverviewComponent,
    AddPurchaseComponent
  ],
  imports: [
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    OverviewComponent,
    AddPurchaseComponent
  ],
  providers: [{provide: ErrorHandler, useClass: IonicErrorHandler}]
})
export class AppModule {}
