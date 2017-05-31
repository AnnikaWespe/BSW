import { Injectable } from '@angular/core';

import {MOCK_USER_DETAIL} from "./mock_user-detail";


@Injectable()
export class UserDetailProvider {

  constructor() {
  }
  getUserDetail(){
    return MOCK_USER_DETAIL;
  }


}
