import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { ProductDetailsComponent } from './product-details/product-details.component';
import { OutsComponent } from './product-details/outs/outs.component';
import { ProductLabelsComponent } from './product-details/product-labels/product-labels.component';
import { PlugsSpreadsComponent } from './product-details/plugs-spreads/plugs-spreads.component';
import { SupplierComponent } from './product-details/supplier/supplier.component';
import { PanoramaComponent } from './panorama/panorama.component';
import { SelectionAreaComponent } from './selection-area/selection-area.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    AppComponent,
    ProductDetailsComponent,
    OutsComponent,
    ProductLabelsComponent,
    PlugsSpreadsComponent,
    SupplierComponent,
    PanoramaComponent,
    SelectionAreaComponent
  ],
  imports: [
    BrowserModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
