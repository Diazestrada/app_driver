import { Component } from '@angular/core'
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular'
import { FormBuilder, FormGroup } from '@angular/forms'
import 'rxjs/add/operator/map'

import { SocialSharing } from '@ionic-native/social-sharing'

import { CONFIG } from '@providers/config'
import { StorageDb } from '@providers/storageDb'
import { FreightProvider } from '@providers/api/freight'

@IonicPage()
@Component({
  selector: 'find-freight-driver',
  templateUrl: 'find-freight.html'
})
export class FindFreightDriverPage {

  offers: any = []
  user_id: string

  iconBtnFilters =[
    'ios-arrow-dropdown',
    'ios-arrow-dropup'
  ]

  iconFilter = this.iconBtnFilters[0]
  hiddenFilters = true

  findForm: FormGroup

  vehicle_class = {
    title: 'Clase de vehículo',
    options: [
      {value: 'Camioneta', name: 'Camioneta', checked: false},
      {value: 'Turbo', name: 'Turbo', checked: false},
      {value: 'Sencillo', name:'Sencillo', checked: false},
      {value: 'Doble Troque', name:'Doble Troque', checked: false},
      {value: 'Cuatro Manos', name:'Cuatro Manos', checked: false},
      {value: 'Minimula', name:'Minimula', checked: false},
      {value: 'Tracto Camión', name:'Tracto Camión', checked: false},
    ]
  }

  vehicle_bodywork = {
    title: 'Tipo de carrocería',
    options: [
      {value: 'Carry', name: 'Carry', checked: false},
      {value: 'Estacas', name: 'Estacas', checked: false},
      {value: 'Furgón', name:'Furgón', checked: false},
      {value: 'Furgón Refrigerado', name:'Furgón Refrigerado', checked: false},
      {value: 'Platón', name:'Platón', checked: false},
      {value: 'Plancha', name:'Plancha', checked: false},
      {value: 'Cisterna', name:'Cisterna', checked: false},
      {value: 'Tanque', name:'Tanque', checked: false},
      {value: 'Volco', name:'Volco', checked: false},
      {value: 'Porta Contenedor', name:'Porta Contenedor', checked: false},
      {value: 'Contenedor', name:'Contenedor', checked: false},
      {value: 'Cama Baja', name:'Cama Baja', checked: false},
      {value: 'Niñera', name:'Niñera', checked: false}
    ]
  }

  origin_list: any = []
  destination_list: any = []

  constructor(
    public navCtrl: NavController,
    public apiFreight: FreightProvider,
    public db: StorageDb,
    public navParams: NavParams,
    private formBuilder: FormBuilder,
    public modalCtrl: ModalController,
    private socialSharing: SocialSharing) {

      this.findForm = this.formBuilder.group({
        type: [''],
        bodywork: [''],
        date:[''],
        origin: [''],
        destination: ['']
      })

  }

  ionViewWillEnter(){
    this.getFreights()
  }

  async getUserId(){
    return await this.db.getItem(CONFIG.localdb.USER_KEY).then(res =>{
      return res.userId
    })
  }

  async getFreights(){
    this.offers = []
    const userId = await this.getUserId()

    this.apiFreight.getOffert().then(res =>{
      // console.log(JSON.stringify(res))
      const data = res['data']
      const array = []

      data.forEach(e => {
        if(e['state'].sequence < 5){
          const drivers = e['postulantes']
          if(drivers.length > 0){
            let isDriver = false
             for(let i of drivers){
                 if(i._id === userId){
                   isDriver = true
               }
             }
             if(!isDriver){
               array.push(e)
             }
          }else{
            array.push(e)
          }
        }
      })

      if(array.length > 0){
        array.sort((a, b) => new Date(b.fecha_creacion).getTime() - new Date(a.fecha_creacion).getTime())
      }
      // console.log(JSON.stringify(array))
      // console.log(JSON.stringify(data))
      this.offers = array

    }).catch(e =>{
      console.error(e)
    })
  }

  freightDetails(freight){
    this.navCtrl.push('DetailsFreightDriverPage', { id: freight._id, mode: 0})
  }

  doRefresh(refresher) {
    this.getFreights()
    setTimeout(() => {
      refresher.complete()
    }, 2000)
  }

  shared(freight){
    const message = `No DE PEDIDO: ${freight.pedido}. Ruta: ${freight.ciudad_origen.toUpperCase()}-${freight.ciudad_destino.toUpperCase()}. Vehículo: ${freight.clase_vehiculo.toUpperCase()}-${freight.tipo_carroceria.toUpperCase()}. Peso: ${freight.peso_carga_max} TON. CONTACTO: ${freight.coordinador.primer_nombre.toUpperCase()} ${freight.coordinador.primer_apellido.toUpperCase()}, ${freight.coordinador.celular}, Si quieres pago contra entrega, pregunta por PagaYa!!! http://tiny.cc/u09z5y`
    const subject  = 'Carga Disponible, postulate'
    const file = null
    const url = null

    this.socialSharing.share(message, subject, file, url)
  }


  showModal(mode){
    let options
    let radio
    if(mode === 0){
        options = this.vehicle_class
        radio = this.findForm.controls['type'].value
    }else if(mode === 1){
        options = this.vehicle_bodywork
        radio = this.findForm.controls['bodywork'].value
    }else if(mode === 2){
      options = this.origin_list
      radio = this.findForm.controls['origin'].value
    }else if(mode === 3){
      options = this.destination_list
      radio = this.findForm.controls['destination'].value
    }
    const modal = this.modalCtrl.create('ModalRadioDriverComponent', {options, radio })
    modal.present()

    modal.onDidDismiss((data) =>{
      console.log('onDismiss ' + JSON.stringify(data) + ' MODE ' + mode + " " + data)
      if(mode === 0){
        if(data != null){
          this.findForm.controls['type'].setValue(data.radio)
        }
      }else if(mode === 1){
        if(data != null){
          this.findForm.controls['bodywork'].setValue(data.radio)
        }
      }else if(mode === 2){
        if(data != null){
          this.findForm.controls['origin'].setValue(data.radio)
        }
      }else if(mode === 3){
        if(data != null){
          this.findForm.controls['destination'].setValue(data.radio)
        }
      }
    })
  }

  search(){
    console.log(this.findForm)
  }

  toogleSearch(icon){
    const index = this.iconBtnFilters.indexOf(icon)
    if(index === 0){
      this.iconFilter = this.iconBtnFilters[1]
      this.hiddenFilters = false
    }else if(index === 1){
      this.iconFilter = this.iconBtnFilters[0]
      this.hiddenFilters = true
    }
  }

  resetFilters(){
    this.findForm.reset()
    this.getFreights()
  }

}
