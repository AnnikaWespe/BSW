import {Component, trigger, state, style, OnInit} from '@angular/core';
import {AlertController, NavController, NavParams, ViewController} from 'ionic-angular';
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
              private changePasswordService: ChangePasswordService,
              private alertCtrl: AlertController) {
    this.passwordForm = formBuilder.group({
      oldPassword: ['', Validators.required],
      newPassword: ['', Validators.required],
      newPasswordRepeat: ['', Validators.required]
    }, {validator: this.passwordsMatch()})
  }

  navigateBack() {
    this.viewCtrl.dismiss({passwordChanged: false});
  }


  passwordsMatch() {
    return (group: FormGroup): { [key: string]: any } => {
      let password = group.controls['newPassword'];
      let confirmPassword = group.controls['newPasswordRepeat'];
      if (password.value !== confirmPassword.value) {
        return {
          mismatchedPasswords: true
        };
      }
    }
  }


  onSubmit() {
    this.changePasswordService.changePassword(this.passwordForm.value.oldPassword, this.passwordForm.value.newPassword).subscribe((res) => {
      let response = res.json();
      if (response.errors[0].beschreibung === "Erfolg") {
        localStorage.setItem("securityToken", response.response.securityToken)
        this.viewCtrl.dismiss({passwordChanged: true});
      }
      else {
        console.log(response.errors[0].beschreibung);
        this.presentAlertPasswordNotChanged();
      }
    })

  }

  presentAlertPasswordNotChanged() {
    let alert = this.alertCtrl.create({
      title: 'Passwort ändern fehlgeschlagen',
      subTitle: 'Bitte versuchen Sie es erneut.',
      buttons: ['Ok']
    });
    alert.present();
  }

}
