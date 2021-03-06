import { Component } from '@angular/core'
import { IonicPage, NavController, NavParams, MenuController, LoadingController, ModalController, Platform } from 'ionic-angular'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'

import { Keyboard } from '@ionic-native/keyboard'
import { AppVersion } from '@ionic-native/app-version'

import { User } from '@models/user'

import { AlertsProvider } from '@providers/alerts'
import { DriverAuthProvider } from '@providers/api/driverAuth'
import { CompanyAuthProvider } from '@providers/api/companyAuth'
import { StorageDb } from '@providers/storageDb'
import { CONFIG } from '@providers/config'


@IonicPage()
@Component({
  selector: 'login-shared',
  templateUrl: 'login.html',
})
export class LoginSharedPage {

  user = {} as User
  idForm: FormGroup
  passwordForm: FormGroup

  email_validator = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  password_validator = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{6,}$/
  id_validator =  /^\d+$/

  sectionSelected: number = 0

  hideFooter: boolean = false
  user_type: string = ''
  mode: string
  version: string = ''
  envVersion: string = ''

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public alert: AlertsProvider,
    private formBuilder: FormBuilder,
    private driverAuth: DriverAuthProvider,
    private companyAuth: CompanyAuthProvider,
    public loadingCtrl: LoadingController,
    public modalCtrl: ModalController,
    public db: StorageDb,
    public menu: MenuController,
    public plt: Platform,
    public keyboard: Keyboard,
    public appVersion: AppVersion
    ) {

      this.idForm = this.formBuilder.group({
        id: ['', Validators.compose([
          Validators.pattern(this.id_validator),
          Validators.minLength(6),
          Validators.required
        ])]
      });

      this.passwordForm = this.formBuilder.group({
        password: ['', Validators.compose([
          Validators.minLength(6),
          Validators.required
        ])]
      });

      this.mode = this.navParams.get('mode')

      if(this.mode === 'driver'){
        this.user_type = 'Conductor'
      }else if(this.mode === 'company'){
        this.user_type = 'Empresa'
      }
    }

  ionViewDidLoad() {
    this.menu.enable(false)
    if(CONFIG.environment === 'dev'){
      this.envVersion = 'Beta'
    }else{
      this.envVersion = ''
    }

    this.keyboard.onKeyboardShow().subscribe(data =>{
      this.hideFooter = true
    })

    this.keyboard.onKeyboardHide().subscribe(data =>{
      this.hideFooter = false
    })

    this.getAppVersion()
  }

  ionViewDidEnter() {
    this.sectionSelected = 1
  }

  getAppVersion(){
    if(this.plt.is('cordova')){
      this.appVersion.getVersionNumber().then(res =>{
        this.version = res
      })
    }
  }

  validateId(){
    const id = parseInt(this.idForm.controls['id'].value)
    if(this.mode === 'driver'){
      this.validateDriver(id)
    }else if(this.mode === 'company'){
      this.validateCompany(id)
    }
  }

  validateDriver(id){
    this.driverAuth.validateId(id).then(res =>{
      console.log('validate driver ' + JSON.stringify(res))
      this.checkValidate(id, res)
    })
  }

  validateCompany(id){
    this.companyAuth.validateId(id).then(res =>{
      this.checkValidate(id, res)
    })
  }

  checkValidate(id, res){
    const code = res['data'].code
    if(code === 100){
      this.sectionSelected = 2
    }else if(code === 101){
      this.navCtrl.push('RegisterSharedPage', { id: id, mode: this.mode })
    }
  }

  login(){

    this.user.id = parseInt(this.idForm.controls['id'].value)
    this.user.password = this.passwordForm.controls['password'].value
    console.log('login baby')
    if(this.mode === 'driver'){
      this.loginDriver()
    }else if(this.mode === 'company'){
      this.loginCompany()
    }

  }

  loginDriver(){

    const loader = this.loadingCtrl.create({})
    loader.present()

    this.driverAuth.login(this.user).then(res =>{
      loader.dismiss()
      this.checkResponse(res)
    }).catch(e =>{
      console.log(e)
      loader.dismiss()
      this.alert.showAlert('Error', 'No se encuentra el usuario, verifique los datos e intente de nuevo')
    })
  }

  loginCompany(){

    const loader = this.loadingCtrl.create({})
    loader.present()

    this.companyAuth.login(this.user).then(res =>{
      loader.dismiss()
      this.checkResponse(res)
    }).catch(e =>{
      console.log(e)
      loader.dismiss()
      this.alert.showAlert('Error', 'No se encuentra el usuario, verifique los datos e intente de nuevo')
    })
  }

  checkResponse(res){
    console.log('login response ' + JSON.stringify(res))
    const code = res['data'].code

    if(code === 100){

      const id = res['data'].id_conductor

      const sessionData = {
        userId: id,
        user: this.user.id,
        token: res['data'].token,
        type: this.mode
      }

      this.db.setItem(CONFIG.localdb.USER_KEY, sessionData).then(res =>{
        if(this.mode === 'driver'){
          this.navCtrl.setRoot('home-drive')
        }else if(this.mode === 'company'){
          this.navCtrl.setRoot('home-company')
        }
      }).catch(e =>{
        console.log(e)
        this.alert.showAlert('Error', 'Error al crear la sesión')
      })
    }else{
      const msg = res['data'].message
      this.alert.showAlert('Error', msg)
    }
  }

  getSupport(){
    this.navCtrl.push('SupportSharedPage')
  }

  resetPassword(){
    const modal = this.modalCtrl.create('ModalForgotPasswordComponent', null, { cssClass: 'modal-id' })
    modal.present()
  }

}
