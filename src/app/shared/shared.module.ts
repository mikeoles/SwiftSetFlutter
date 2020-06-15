import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalComponent } from './modal/modal.component';
import { SearchPipe } from '../pipes/search-filter.pipe';

@NgModule({
  declarations: [
    ModalComponent,
    SearchPipe
  ],
  imports: [
    CommonModule,
  ],
  exports: [
    ModalComponent,
    SearchPipe
  ],
})
export class SharedModule { }
