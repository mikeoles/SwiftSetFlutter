import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { ProductDetailsComponent } from './product-details/product-details.component';
import { GridComponent } from './product-details/grid/grid.component';
import { PanoramaComponent } from './panorama/panorama.component';
import { SelectionAreaComponent } from './selection-area/selection-area.component';
import { FormsModule } from '@angular/forms';
import { DataDisplayComponent } from './data-display/data-display.component';
import { CountGraphComponent } from './data-display/count-graph/count-graph.component';
import { StatRingComponent } from './data-display/stat-ring/stat-ring.component';
import { DataGridComponent } from './data-display/data-grid/data-grid.component';
import { RoundProgressModule } from 'angular-svg-round-progressbar';

@NgModule({
  declarations: [
    AppComponent,
    ProductDetailsComponent,
    GridComponent,
    PanoramaComponent,
    SelectionAreaComponent,
    DataDisplayComponent,
    CountGraphComponent,
    StatRingComponent,
    DataGridComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    RoundProgressModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
