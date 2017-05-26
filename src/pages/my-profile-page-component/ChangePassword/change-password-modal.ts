import {Component, trigger, state, style} from '@angular/core';
import {NavController, NavParams, ViewController} from 'ionic-angular';


@Component({
  selector: 'change-password-modal',
  templateUrl: 'change-password-modal.html',
})
export class ChangePasswordModal {
  title: string = "Passwort ändern";


  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public viewCtrl: ViewController) {
  }

  navigateBack() {
    this.viewCtrl.dismiss();
  }

}
