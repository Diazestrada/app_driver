import { Component } from '@angular/core'
import { IonicPage, NavController, NavParams, Keyboard } from 'ionic-angular'

import { CitiesProvider } from '@providers/cities'
import { CartProvider } from '@providers/api/cart'

@IonicPage()
@Component({
  selector: 'availability-drive',
  templateUrl: 'availability.html'
})
export class AvailabilityDriverPage {

  citiesList: any = []
  citiesFilter: any = []
  citySelected: string = ''
  vehicles : any = []

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public cities: CitiesProvider,
    public cart: CartProvider,
    public keyboard: Keyboard
    ) {


  }

  ionViewDidLoad(){
    this.getCities()
    this.getVehicles()
  }

  getCities(){
    this.cities.getAllData().then(res =>{
      this.cities.getAllCities().then(res =>{
        this.citiesList = res
      })
    })
  }

  removeFocus() {
    this.keyboard.close()
  }

  getItems() {

    if (!this.citySelected.trim().length || !this.keyboard.isOpen()) {
      this.citiesFilter = []
      return
    }
    this.citiesFilter = this.citiesList
    this.citiesFilter = this.citiesFilter.filter(item => item.toUpperCase().includes(this.citySelected.toUpperCase()))
  }

  selectCity(city){
    console.log(city)
    this.citySelected = city
    this.citiesFilter = []
  }

  getVehicles(){
    this.cart.getVehiclesList().then(res =>{
      this.vehicles = res['data']['data']
      console.log(JSON.stringify(this.vehicles))
    })
  }

}
