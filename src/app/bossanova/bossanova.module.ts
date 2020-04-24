import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BossanovaFleetViewComponent } from './bossanova-fleet-view/bossanova-fleet-view.component';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';



@NgModule({
  declarations: [
    BossanovaFleetViewComponent
  ],
  imports: [
    CommonModule,
    Ng2SearchPipeModule,
    FormsModule,
    RouterModule,
    FontAwesomeModule
  ],
  exports: [
    BossanovaFleetViewComponent
  ]
})
export class BossanovaModule { }
