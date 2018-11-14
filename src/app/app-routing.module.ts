import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { StoreViewComponent } from './store-view/store-view.component';
import { AisleViewComponent } from './aisle-view/aisle-view.component';

const routes: Routes = [
  { path: 'mission/:missionId/aisle/:aisleId', component: AisleViewComponent },
  { path: 'mission/:id', component: PageNotFoundComponent },
  { path: 'store', component: StoreViewComponent },
  { path: '',
    redirectTo: '/store',
    pathMatch: 'full'
  },
  { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
