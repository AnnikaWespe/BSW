import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

import {MonthlyExpenses} from './monthlyExpenses';
import {MONTHLY_EXPENSES} from './mock-monthly-expenses';

@Injectable()
export class MonthlyExpensesService {

  getPastExpenses(): MonthlyExpenses[] {
    return MONTHLY_EXPENSES;
  }

}
