import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

import {MonthlySavings} from './monthlySavings';
import {MONTHLY_SAVINGS} from './mock-monthly-savings';

@Injectable()
export class MonthlySavingsService {

  getPastExpenses(): MonthlySavings[] {
    return MONTHLY_SAVINGS;
  }

}
