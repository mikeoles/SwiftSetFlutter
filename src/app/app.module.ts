import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { ProductDetailsComponent } from './aisle-view/product-details/product-details.component';
import { GridComponent } from './aisle-view/product-details/grid/grid.component';
import { PanoramaComponent } from './aisle-view/panorama/panorama.component';
import { SelectionAreaComponent } from './aisle-view/selection-area/selection-area.component';
import { FormsModule } from '@angular/forms';
import { StoreViewComponent } from './store-view/store-view.component';
import { CountGraphComponent } from './store-view/count-graph/count-graph.component';
import { StatRingComponent } from './store-view/stat-ring/stat-ring.component';
import { DataGridComponent } from './store-view/data-grid/data-grid.component';
import { RoundProgressModule } from 'angular-svg-round-progressbar';
import { ChartsModule } from 'ng2-charts/ng2-charts';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { AisleViewComponent } from './aisle-view/aisle-view.component';
import { AppRoutingModule } from './app-routing.module';

@NgModule({
  declarations: [
    AppComponent,
    ProductDetailsComponent,
    GridComponent,
    PanoramaComponent,
    SelectionAreaComponent,
    StoreViewComponent,
    CountGraphComponent,
    StatRingComponent,
    DataGridComponent,
    PageNotFoundComponent,
    AisleViewComponent,
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
