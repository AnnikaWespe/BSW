import {Component, trigger, state, style, OnInit} from '@angular/core';
import {AlertController, NavController, NavParams, ViewController} from 'ionic-angular';
import {FormGroup, Validators, FormBuilder} from "@angular/forms";
import {AuthService} from "../../../services/auth-service";


@Component({
  selector: 'change-password-modal',
  templateUrl: 'change-password-modal.html',
})
export class ChangePasswordModal {
  title: string = "Passwort ändern";
  oldPassword = "";
  newPassword = "";
  newPasswordConfirm = "";


  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public viewCtrl: ViewController,
              private formBuilder: FormBuilder,
              private authService: AuthService,
              private alertCtrl: AlertController) {
  }

  navigateBack() {
    this.viewCtrl.dismiss({passwordChanged: false});
  }


  onSubmit() {
    if (this.oldPassword == "") {
      this.presentAlertPleaseChangeInput("Fehlende Eingabe: Altes Passwort")
    }
    else if (this.newPassword == "") {
      this.presentAlertPleaseChangeInput("Fehlende Eingabe: Neues Passwort")
    }
    else if (this.newPasswordConfirm == "") {
      this.presentAlertPleaseChangeInput("Fehlende Eingabe: Neues Passwort bestätigen")
    }
    else if (this.newPassword !== this.newPasswordConfirm) {
      this.presentAlertPleaseChangeInput('"Passwort" und "Passwort bestätigen" stimmen nicht überein')
    }
    else {
      this.authService.changePassword(this.oldPassword, this.newPassword).then(
        () => {
          this.viewCtrl.dismiss({passwordChanged: true});
        },
        () => {
          this.presentAlertPasswordNotChanged();
        }
      );
    }
  }

  presentAlertPleaseChangeInput(title) {
    let alert = this.alertCtrl.create({
      title: title,
      subTitle: 'Bitte korrigieren Sie Ihre Eingabe.',
      buttons: ['Ok']
    });
    alert.present();
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
