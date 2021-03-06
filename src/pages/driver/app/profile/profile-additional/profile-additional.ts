import { Component, ViewChild } from '@angular/core'
import { IonicPage, NavController, NavParams, Content, LoadingController } from 'ionic-angular'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'

import { DataUserC } from '@models/dataUserC'

import { CitiesProvider } from '@providers/cities'
import { DriverAuthProvider } from '@providers/api/driverAuth'
import { AlertsProvider } from '@providers/alerts'

@IonicPage()
@Component({
  selector: 'profile-additional-driver',
  templateUrl: 'profile-additional.html'
})
export class ProfileAdditionalDriverPage {

  @ViewChild(Content) content: Content

  profileForm: FormGroup
  profileForm_0: FormGroup

  driver = {} as DataUserC
  profile: any
  step_form: number = 0
  id_departamento: number
  departamento: string = ''
  ciuades: any = []
  step_images: any = [
    './assets/imgs/step-1-2.png',
    './assets/imgs/step-2-2.png'
  ]
  step_img: string = this.step_images[0]

  departmentsOptions: any = []
  citiesOptions: any = []

  gender_options = [
    { value: 'Femenino', name: 'Femenino' },
    { value: 'Masculino', name: 'Masculino' },
    { value: 'Prefiero no decir', name: 'Prefiero no decir' }
  ]

  blob_types = [
    { value: 'A+', name: 'A+' },
    { value: 'A-', name: 'A-' },
    { value: 'B+', name: 'B+' },
    { value: 'B-', name: 'B-' },
    { value: 'O+', name: 'O+' },
    { value: 'O-', name: 'O-' },
    { value: 'AB+', name: 'AB+' },
    { value: 'AB-', name: 'AB-' },
  ]

  plate_category = [
    { value: 'B1', name: 'B1' },
    { value: 'B2', name: 'B2' },
    { value: 'B3', name: 'B3' },
    { value: 'C1', name: 'C1' },
    { value: 'C2', name: 'C2' },
    { value: 'C3', name: 'C3' },
  ]

  user: any

  constructor(
    public navCtrl: NavController,
    private formBuilder: FormBuilder,
    public auth: DriverAuthProvider,
    public cities: CitiesProvider,
    public loadingCtrl: LoadingController,
    public alert: AlertsProvider,
    public navParams: NavParams) {

    this.setForms()

    this.user = this.navParams.get('profile')

    if (this.user != null) {

      const dateForm = this.user.fecha_expedicion_cedula !== undefined ? this.user.fecha_expedicion_cedula : ''
      const placeForm = this.user.lugar_expedicion_cedula !== undefined ? this.user.lugar_expedicion_cedula : ''
      const countryForm = this.user.pais !== undefined ? this.user.pais : ''
      const stateForm = this.user.departamento !== undefined ? this.user.departamento : ''
      const cityForm = this.user.ciudad !== undefined ? this.user.ciudad : ''
      const addressForm = this.user.direccion !== undefined ? this.user.direccion : ''
      const phone = this.user.telefono_1 !== undefined ? this.user.telefono_1 : ''

      this.profileForm.controls['date'].setValue(dateForm)
      this.profileForm.controls['place'].setValue(placeForm)
      this.profileForm.controls['country'].setValue(countryForm)
      this.profileForm.controls['state'].setValue(stateForm)
      this.profileForm.controls['city'].patchValue(cityForm)
      this.profileForm.controls['address'].setValue(addressForm)
      this.profileForm.controls['phone'].setValue(phone)

      this.profileForm_0.controls['date'].setValue(this.user.fecha_nacimiento)
      this.profileForm_0.controls['place'].setValue(this.user.lugar_nacimiento)
      this.profileForm_0.controls['arl'].setValue(this.user.nombre_arl)
      this.profileForm_0.controls['eps'].setValue(this.user.nombre_eps)
      this.profileForm_0.controls['found'].setValue(this.user.nombre_fondo)
      this.profileForm_0.controls['license_plate'].setValue(this.user.numero_licencia_conducir)
      this.profileForm_0.controls['license_category'].setValue(this.user.categoria_licencia)
      this.profileForm_0.controls['license_expiration'].setValue(this.user.vencimiento_licencia)
      this.profileForm_0.controls['rh'].setValue(this.user.tipo_sangre)
      this.profileForm_0.controls['gender'].setValue(this.user.genero)
    }
  }

  ionViewDidLoad() {
    this.getDepartment()
  }

  getDepartment(){
    this.cities.getAllData().then(() =>{
      this.cities.getDepartments().then(res =>{
        this.departmentsOptions = res
        this.getCity()
      })
    })
  }

  getCity(){
    const department = this.profileForm.controls['state'].value
    if(department !== undefined && department !== ''){
      const i = this.departmentsOptions.indexOf(department)
      this.cities.getCities(i).then(res =>{
        this.citiesOptions = res
      })
    }
  }

  setForms() {
    this.profileForm = this.formBuilder.group({
      date: ['', Validators.compose([
        // Validators.minLength(3),
        // Validators.required
      ])],
      place: ['', Validators.compose([
        // Validators.minLength(3),
        // Validators.required
      ])],
      country: ['', Validators.compose([
        // Validators.minLength(3),
        // Validators.required
      ])],
      state: ['', Validators.compose([
        // Validators.minLength(3),
        // Validators.required
      ])],
      city: ['', Validators.compose([
        // Validators.minLength(3),
        // Validators.required
      ])],
      address: ['', Validators.compose([
        // Validators.minLength(3),
        // Validators.required
      ])],
      phone: ['', Validators.compose([
        // Validators.minLength(6),
        // Validators.required
      ])]
    })


    this.profileForm_0 = this.formBuilder.group({
      date: ['', Validators.compose([
        Validators.minLength(3),
        // Validators.required
      ])],
      place: ['', Validators.compose([
        Validators.minLength(3),
        // Validators.required
      ])],
      arl: ['', Validators.compose([
        Validators.minLength(3),
        // Validators.required
      ])],
      eps: ['', Validators.compose([
        Validators.minLength(3),
        // Validators.required
      ])],
      found: ['', Validators.compose([
        Validators.minLength(3),
        // Validators.required
      ])],
      license_plate: ['', Validators.compose([
        Validators.minLength(7),
        // Validators.required
      ])],
      license_category: ['', Validators.compose([
        Validators.minLength(1),
        // Validators.required
      ])],
      license_expiration: ['', Validators.compose([
        Validators.minLength(3),
        // Validators.required
      ])],
      rh: ['', Validators.compose([
        Validators.minLength(2),
        // Validators.required
      ])],
      gender: ['', Validators.compose([
        Validators.minLength(3),
        // Validators.required
      ])]
    })
  }

  save() {
    if (this.step_form === 0) {

      if (
        this.profileForm.controls['date'].value !== this.driver.fecha_expedicion_cedula
        || this.profileForm.controls['place'].value !== this.driver.lugar_expedicion_cedula
        || this.profileForm.controls['country'].value !== this.driver.pais
        || this.profileForm.controls['state'].value !== this.driver.departamento
        || this.profileForm.controls['city'].value !== this.driver.ciudad
        || this.profileForm.controls['address'].value !== this.driver.direccion
        || this.profileForm.controls['phone'].value !== this.driver.telefono_1
      ) {
        this.driver.fecha_expedicion_cedula = this.profileForm.controls['date'].value
        this.driver.lugar_expedicion_cedula = this.profileForm.controls['place'].value
        this.driver.pais = this.profileForm.controls['country'].value
        this.driver.departamento = this.profileForm.controls['state'].value
        this.driver.ciudad = this.profileForm.controls['city'].value
        this.driver.direccion = this.profileForm.controls['address'].value
        this.driver.telefono_1 = this.profileForm.controls['phone'].value

        const loader = this.loadingCtrl.create({})
        loader.present()

        this.auth.updateDriverC(this.driver).then(res => {
          console.log(JSON.stringify(res))
          loader.dismiss()
          this.alert.showAlert('Perfil Actualizado', 'Se ha actualizado tu perfil correctamente')
        }).catch(e => {
          console.error(e)
          loader.dismiss()
          this.alert.showAlert('Error', 'Ha ocurrido un error actualizando tus datos, intenta de nuevo.')
        })
      }

      this.step_form++
      this.step_img = this.step_images[1]
      this.scrollToTop()
    } else if (this.step_form === 1) {

      if (
        this.profileForm_0.controls['date'].value !== this.driver.fecha_nacimiento
        || this.profileForm_0.controls['place'].value !== this.driver.lugar_nacimiento
        || this.profileForm_0.controls['arl'].value !== this.driver.nombre_arl
        || this.profileForm_0.controls['eps'].value !== this.driver.nombre_eps
        || this.profileForm_0.controls['found'].value !== this.driver.nombre_fondo
        || this.profileForm_0.controls['license_plate'].value !== this.driver.numero_licencia_conducir
        || this.profileForm_0.controls['license_category'].value !== this.driver.categoria_licencia
        || this.profileForm_0.controls['license_expiration'].value !== this.driver.vencimiento_licencia
        || this.profileForm_0.controls['rh'].value !== this.driver.tipo_sangre
        || this.profileForm_0.controls['gender'].value !== this.driver.genero
      ) {
        this.driver.fecha_nacimiento = this.profileForm_0.controls['date'].value
        this.driver.lugar_nacimiento = this.profileForm_0.controls['place'].value
        this.driver.nombre_arl = this.profileForm_0.controls['arl'].value
        this.driver.nombre_eps = this.profileForm_0.controls['eps'].value
        this.driver.nombre_fondo = this.profileForm_0.controls['found'].value
        this.driver.numero_licencia_conducir = this.profileForm_0.controls['license_plate'].value
        this.driver.categoria_licencia = this.profileForm_0.controls['license_category'].value
        this.driver.vencimiento_licencia = this.profileForm_0.controls['license_expiration'].value
        this.driver.tipo_sangre = this.profileForm_0.controls['rh'].value
        this.driver.genero = this.profileForm_0.controls['gender'].value

        const loader = this.loadingCtrl.create({})
        loader.present()

        this.auth.updateDriverC(this.driver).then(res => {
          console.log(JSON.stringify(res))
          loader.dismiss()
          this.alert.showAlert('Perfil Actualizado', 'Se ha actualizado tu perfil correctamente')
        }).catch(e => {
          console.error(e)
          loader.dismiss()
          this.alert.showAlert('Error', 'Ha ocurrido un error actualizando tus datos, intenta de nuevo.')
        })
      }
      this.navCtrl.pop()


    }
  }

  scrollToTop() {
    this.content.scrollToTop()
  }

  toCapitalize(v, property) {
    let value
    if (typeof (v) === 'string') {
      value = v.charAt(0).toUpperCase() + v.slice(1)
    } else if (typeof (v) === 'object') {
      value = v._value.toString().charAt(0).toUpperCase() + v._value.toString().slice(1)
    }
    if (this.profileForm.controls[property] !== undefined) {
      this.profileForm.controls[property].setValue(value)
    } else if (this.profileForm_0.controls[property] !== undefined) {
      this.profileForm_0.controls[property].setValue(value)
    }
  }

}
