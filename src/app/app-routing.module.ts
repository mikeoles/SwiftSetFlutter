import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { StoreViewComponent } from './store-view/store-view.component';
import { AisleViewComponent } from './aisle-view/aisle-view.component';
import { MissionViewComponent } from './mission-view/mission-view.component';
import { FleetViewComponent } from './fleet-view/fleet-view.component';

const routes: Routes = [
  { path: 'store/:storeId/mission/:missionId/aisle/:aisleId', component: AisleViewComponent },
  { path: 'store/:storeId/mission/:missionId', component: MissionViewComponent },
  { path: 'store/:storeId', component: StoreViewComponent },
  { path: '', component: FleetViewComponent, pathMatch: 'full' },
  { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
