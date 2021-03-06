import { Injectable } from '@angular/core'

import firebase from 'firebase/app'
import 'firebase/database'
import 'firebase/storage'

@Injectable()
export class FirebaseProvider{

  database: any
  storage: any
  imgRef: any

   constructor(){

      this.database = firebase.database()
      this.storage = firebase.storage()

   }

   uploadPicture(data, id, name){

    const imgRef = this.storage.ref(`drivers/${id}/${name}`)
     return new Promise((resolve, reject) =>{
      const task = imgRef.putString(data, 'base64', {contentType:'image/jpg'})
      task.on(
        'state_changed',
        snapshot => {
            const percentage = snapshot.bytesTransferred / snapshot.totalBytes * 100
            console.log(percentage)
        },
        error => {
            reject(error)
        },
        () => {
            imgRef.getDownloadURL().then(resUrl => {
                resolve(resUrl)
            })
        }
      )
    })

   }

   async saveImageProfilePath(mode, data, userId, vehicleId){
     let reference = `drivers/${userId}`
     switch(mode){
       case 0:
        reference += '/profile/myPhotos'
       break;
       case 1:
        reference += '/profile/BankInformation'
       break;
       case 2:
        reference += `/vehiclesDocumentation/${vehicleId}`
       break;
       case 3:
        reference += `/vehiclesImages/${vehicleId}`
       break;
       case 4:
        reference += `/ownerImages/${vehicleId}`
       break;
     }

    return await this.database.ref(reference).set(data)
   }

   async updateBankImagesPath(userId, data){
    let reference = `drivers/${userId}/profile/BankInformation`
    return await this.database.ref(reference).update(data)
   }

   getProfilePicture(mode, userId, vehicleId){

    let reference = `drivers/${userId}`
     switch(mode){
       case 0:
        reference += '/profile/myPhotos'
       break;
       case 1:
        reference += '/profile/BankInformation'
       break;
       case 2:
        reference += `/vehiclesDocumentation/${vehicleId}`
       break;
       case 3:
        reference += `/vehiclesImages/${vehicleId}`
       break;
       case 4:
        reference += `/ownerImages/${vehicleId}`
       break;
     }

    const imgRef = this.database.ref(reference)
    return new Promise((resolve, reject) =>{
      imgRef.once('value', (snap)=>{
        console.log(snap.val(),'snap de Picture')
        resolve(snap.val())
      }, (e) =>{
        reject(e)
      })
    })
   }

   async saveOfferLoad(data, userId, offerId, name ){
    const reference = this.database.ref(`drivers/${userId}/offers/${offerId}/${name}`)
    return await this.database.ref(reference).set(data)
   }

   async getOfferLoad(userId, offerId){
    const reference = this.database.ref(`drivers/${userId}/offers/${offerId}`)

    return new Promise((resolve, reject) =>{
      reference.once('value', (snap)=>{
        console.log(snap.val(),'snap de Picture')
        resolve(snap.val())
      }, (e) =>{
        reject(e)
      })
    })
   }

   async saveTracking(userId, data){
    const reference = this.database.ref(`tracking/${userId}`)
    return await this.database.ref(reference).push(data)
   }

}
