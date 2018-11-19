import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { ProductDetailsComponent } from './product-details/product-details.component';
import { GridComponent } from './product-details/grid/grid.component';
import { PanoramaComponent } from './panorama/panorama.component';
import { SelectionAreaComponent } from './selection-area/selection-area.component';
import { FormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { KeyboardShortcutsModule } from 'ng-keyboard-shortcuts';

@NgModule({
  declarations: [
    AppComponent,
    ProductDetailsComponent,
    GridComponent,
    PanoramaComponent,
    SelectionAreaComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    FontAwesomeModule,
    KeyboardShortcutsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
