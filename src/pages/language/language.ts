import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { WelcomePage } from '../welcome/welcome';

@Component({
  selector: 'page-language',
  templateUrl: 'language.html'
})
export class LanguagePage {

  constructor(public navCtrl: NavController) {
  }
  goToWelcome(params){
    if (!params) params = {};
    this.navCtrl.push(WelcomePage);
  }
}
