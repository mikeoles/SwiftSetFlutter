import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { ProductDetailsComponent } from './aisle-view/product-details/product-details.component';
import { GridComponent } from './aisle-view/product-details/grid/grid.component';
import { PanoramaComponent } from './aisle-view/panorama/panorama.component';
import { SelectionAreaComponent } from './aisle-view/selection-area/selection-area.component';
import { FormsModule } from '@angular/forms';
import { StoreViewComponent } from './store-view/store-view.component';
import { StatRingComponent } from './mission-view/stat-ring/stat-ring.component';
import { MissionsGridComponent } from './store-view/missions-grid/missions-grid.component';
import { RoundProgressModule } from 'angular-svg-round-progressbar';
import { ChartsModule } from 'ng2-charts/ng2-charts';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { AisleViewComponent } from './aisle-view/aisle-view.component';
import { AppRoutingModule } from './app-routing.module';
import { DailyGraphsComponent } from './store-view/daily-graphs/daily-graphs.component';
import { MissionViewComponent } from './mission-view/mission-view.component';
import { AislesGridComponent } from './mission-view/aisles-grid/aisles-grid.component';

@NgModule({
  declarations: [
    AppComponent,
    ProductDetailsComponent,
    GridComponent,
    PanoramaComponent,
    SelectionAreaComponent,
    StoreViewComponent,
    StatRingComponent,
    MissionsGridComponent,
    PageNotFoundComponent,
    AisleViewComponent,
    DailyGraphsComponent,
    MissionViewComponent,
    AislesGridComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    RoundProgressModule,
    ChartsModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
