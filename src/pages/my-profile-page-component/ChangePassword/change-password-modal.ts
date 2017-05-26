import {Component, trigger, state, style, OnInit} from '@angular/core';
import {NavController, NavParams, ViewController} from 'ionic-angular';
import {FormGroup, Validators, FormBuilder} from "@angular/forms";


@Component({
  selector: 'change-password-modal',
  templateUrl: 'change-password-modal.html',
})
export class ChangePasswordModal implements OnInit {
  title: string = "Passwort ändern";
  private passwordForm: FormGroup;
  oldPassword: string;
  newPassword: string;



  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public viewCtrl: ViewController,
              private formBuilder: FormBuilder) {
  }

  navigateBack() {
    this.viewCtrl.dismiss();
  }

  ngOnInit(){
    this.passwordForm = this.formBuilder.group({
      oldPassword: [this.oldPassword, [
        Validators.required,
        Validators.maxLength(24),
      ]],
      newPassword: [this.oldPassword, [
        Validators.required,
        Validators.maxLength(24),
      ]],
      newPasswordRepeat: [this.oldPassword, [
        Validators.required,
        Validators.maxLength(24),
      ]],
    });
  }

}
