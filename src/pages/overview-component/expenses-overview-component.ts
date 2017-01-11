import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import {OnInit} from '@angular/core';

import {MonthlyExpenses} from './monthlyExpenses';
import {MonthlyExpensesService} from './monthly-expenses-service';
@Component({
  selector: 'expenses-overview',
  templateUrl: 'expenses-overview-component.html',
  providers: [MonthlyExpensesService]
})
export class ExpensesOverviewComponent  implements OnInit{

  monthlyExpenses : MonthlyExpenses[];


  constructor(public navCtrl: NavController, public navParams: NavParams, private monthlyExpensesService: MonthlyExpensesService) {}

  ngOnInit(): void{
    this.monthlyExpenses = this.monthlyExpensesService.getPastExpenses();
  }
}
