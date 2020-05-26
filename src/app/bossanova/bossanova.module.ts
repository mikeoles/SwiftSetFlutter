import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BossanovaFleetViewComponent } from './bossanova-fleet-view/bossanova-fleet-view.component';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { BossanovaMissionViewComponent } from './bossanova-mission-view/bossanova-mission-view.component';
import { MissionStatsComponent } from './bossanova-mission-view/mission-stats/mission-stats.component';
import { AislesGridComponent } from './bossanova-mission-view/aisles-grid/aisles-grid.component';
import { SharedModule } from '../shared/shared.module';
import { AuditQueueViewComponent } from './audit-queue-view/audit-queue-view.component';
import { AuditAisleViewComponent } from './audit-aisle-view/audit-aisle-view.component';

@NgModule({
  declarations: [
    BossanovaFleetViewComponent,
    BossanovaMissionViewComponent,
    MissionStatsComponent,
    AislesGridComponent,
    AuditQueueViewComponent,
    AuditAisleViewComponent
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
    BossanovaFleetViewComponent,
    BossanovaMissionViewComponent
  ]
})
export class BossanovaModule { }
