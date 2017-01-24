import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import {SavingsOverviewComponent} from '../pages/overview-page-component/savings-overview-component/savings-overview-component';


@Component({
  providers: [],
  selector: 'page-overview',
  templateUrl: 'overview-component.html',
})
export class OverviewPageComponent{

  title: string = "Übersicht";

  constructor(public navCtrl: NavController, public navParams: NavParams) {}
}
