import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

@Component({

  selector: 'page-overview',
  templateUrl: 'overview-component.html',
})
export class OverviewPageComponent{

  title: string = "Übersicht";

  constructor(public navCtrl: NavController, public navParams: NavParams) {}
}
