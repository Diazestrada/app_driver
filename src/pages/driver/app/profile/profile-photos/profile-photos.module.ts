import { NgModule } from '@angular/core'
import { IonicPageModule } from 'ionic-angular'
import { ProfilePhotoDriverPage } from './profile-photos'

import { ModalCropSharedModule } from '@pages/shared/components/modal-crop/modal-crop.module'

@NgModule({
  declarations: [
    ProfilePhotoDriverPage
  ],
  imports: [
    ModalCropSharedModule,
    IonicPageModule.forChild(ProfilePhotoDriverPage)
  ],
})
export class ProfilePhotoDriverModule {}
