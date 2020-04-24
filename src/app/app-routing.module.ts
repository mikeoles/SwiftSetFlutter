import { NgModule } from '@angular/core';
import { Routes, RouterModule, UrlMatchResult, UrlSegment } from '@angular/router';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { StoreViewComponent } from './store-view/store-view.component';
import { AisleViewComponent } from './aisle-view/aisle-view.component';
import { MissionViewComponent } from './mission-view/mission-view.component';
import { AuthComponent } from './auth/auth.component';
import { AuthGuard } from './auth/auth.guard';
import { DebugViewComponent } from './debug-view/debug-view.component';
import { UnauthorizedComponent } from './unauthorized/unauthorized.component';
import { FleetViewComponent } from './fleet-view/fleet-view.component';

function BossanovaMatcher(url: UrlSegment[]): UrlMatchResult {
  console.log('bossanova ' + UrlSegment[0]);
  return ({consumed: url});
}

function CustomerMatcher(url: UrlSegment[]): UrlMatchResult {
  console.log('customer ' + UrlSegment[0]);
  return null;
}

const routes: Routes = [
  {
    path: 'store/:storeId/mission/:missionId/aisle/:aisleId/debug',
    component: DebugViewComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'store/:storeId/mission/:missionId/aisle/:aisleId',
    component: AisleViewComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'store/:storeId/mission/:missionId',
    component: MissionViewComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'store/:storeId',
    component: StoreViewComponent,
    canActivate: [AuthGuard],
  },
  {
    path: '',
    component: FleetViewComponent,
    canActivate: [AuthGuard],
  },
  { path: 'auth', component: AuthComponent },
  { path: 'unauthorized', component: UnauthorizedComponent },
  { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
