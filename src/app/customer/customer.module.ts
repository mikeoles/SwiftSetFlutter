import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomerFleetViewComponent } from './customer-fleet-view/customer-fleet-view.component';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';



@NgModule({
  declarations: [
    CustomerFleetViewComponent
  ],
  imports: [
    CommonModule,
    Ng2SearchPipeModule,
    FormsModule,
    RouterModule,
    FontAwesomeModule
  ],
  exports: [
    CustomerFleetViewComponent
  ]
})
export class CustomerModule { }
