import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import {OnInit} from '@angular/core';

import {MonthlySavings} from './monthlySavings';
import {MonthlySavingsService} from './monthly-savings-service';
@Component({
  selector: 'savings-overview',
  templateUrl: 'savings-overview-component.html',
  providers: [MonthlySavingsService]
})
export class SavingsOverviewComponent  implements OnInit{

  monthlySavings : MonthlySavings[];
  numberOfMonths : number;


  constructor(public navCtrl: NavController, public navParams: NavParams, private monthlySavingsService: MonthlySavingsService) {}

  ngOnInit(): void{
    this.monthlySavings = this.monthlySavingsService.getPastExpenses();
    this.numberOfMonths= this.monthlySavings.length;

  }
}
