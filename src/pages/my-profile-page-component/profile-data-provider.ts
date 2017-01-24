import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

import {MOCK_PROFILE_DATA} from "./mock-profile-data";


@Injectable()
export class ProfileDataProvider {

  constructor(public http: Http) {
    console.log('Hello ProfileDataProvider Provider');
  }
  getProfileData(){
    return MOCK_PROFILE_DATA;
  }


}
