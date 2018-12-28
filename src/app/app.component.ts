import { Component } from '@angular/core'
import { Platform } from 'ionic-angular'

import { StatusBar } from '@ionic-native/status-bar'
import { SplashScreen } from '@ionic-native/splash-screen'

import { FIREBASE_CONFIG } from './app.firebase.config'
import * as firebase from 'firebase/app'
import 'firebase/auth'

import { LoginPage } from '../pages/auth/login/login'
import { HomePage } from '../pages/app/home/home'
import { MainPage } from '../pages/auth/main/main'
import { RegisterPage } from '../pages/auth/register/register'

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage: any = HomePage

  constructor(
    public platform: Platform, 
    public statusBar: StatusBar, 
    public splashScreen: SplashScreen) {

    this.initializeApp()    
  }


  initializeApp() {
    this.platform.ready().then(() => {
      //firebase.initializeApp(FIREBASE_CONFIG)
      this.statusBar.styleLightContent()
      this.splashScreen.hide()
  
      // const unsubscribe = firebase.auth().onAuthStateChanged(user => {
      //   console.log('user Subscribe ' + user)
      //   if (!user) {
      //     this.rootPage = LoginPage
      //     unsubscribe()
      //   } else {
      //     this.rootPage = HomePage
      //     unsubscribe()
      //   }
      // });
    })
  }
}




