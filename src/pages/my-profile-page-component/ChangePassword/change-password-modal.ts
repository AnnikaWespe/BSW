import {Component, trigger, state, style, OnInit} from '@angular/core';
import {NavController, NavParams, ViewController} from 'ionic-angular';
import {FormGroup, Validators, FormBuilder} from "@angular/forms";
import {ChangePasswordService} from "./changePasswordService";


@Component({
  selector: 'change-password-modal',
  templateUrl: 'change-password-modal.html',
})
export class ChangePasswordModal {
  title: string = "Passwort ändern";
  private passwordForm: FormGroup;
  oldPassword: string;
  newPassword: string;


  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public viewCtrl: ViewController,
              private formBuilder: FormBuilder,
  private changePasswordService: ChangePasswordService) {
    this.passwordForm = formBuilder.group({
      oldPassword: ['', Validators.required],
      newPassword: ['', Validators.required],
      newPasswordRepeat: ['', Validators.required]
    }, {validator: this.passwordsMatch()})
  }

  navigateBack() {
    this.viewCtrl.dismiss();
  }


  passwordsMatch() {
    return (group: FormGroup): {[key: string]: any} => {
      let password = group.controls['newPassword'];
      let confirmPassword = group.controls['newPasswordRepeat'];
      if (password.value !== confirmPassword.value) {
        return {
          mismatchedPasswords: true
        };
      }
    }
  }


  onSubmit(){
    this.changePasswordService.changePassword(this.passwordForm.value.oldPassword, this.passwordForm.value.newPassword).subscribe((res) => {
      console.log(res.json());
    })

    }
}
