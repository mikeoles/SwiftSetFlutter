import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomerFleetViewComponent } from './customer-fleet-view/customer-fleet-view.component';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { CustomerMissionViewComponent } from './customer-mission-view/customer-mission-view.component';
import { MissionStatsComponent } from './customer-mission-view/mission-stats/mission-stats.component';
import { AislesGridComponent } from './customer-mission-view/aisles-grid/aisles-grid.component';
import { SharedModule } from '../shared/shared.module';



@NgModule({
  declarations: [
    CustomerFleetViewComponent,
    CustomerMissionViewComponent,
    MissionStatsComponent,
    AislesGridComponent,
  ],
  imports: [
    CommonModule,
    Ng2SearchPipeModule,
    FormsModule,
    RouterModule,
    FontAwesomeModule,
    SharedModule
  ],
  exports: [
    CustomerFleetViewComponent,
    CustomerMissionViewComponent
  ]
})
export class CustomerModule { }
