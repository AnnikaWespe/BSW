import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

import {MOCK_USER_DETAIL} from "./mock_user-detail";


@Injectable()
export class UserDetailProvider {

  constructor(public http: Http) {
    console.log('Hello UserDetailProvider Provider');
  }
  getUserDetail(){
    return MOCK_USER_DETAIL;
  }


}
