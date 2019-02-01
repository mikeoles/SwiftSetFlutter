import { BrowserModule } from '@angular/platform-browser';
import { NgModule, APP_INITIALIZER } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { AppComponent } from './app.component';
import { ProductDetailsComponent } from './product-details/product-details.component';
import { GridComponent } from './product-details/grid/grid.component';
import { PanoramaComponent } from './panorama/panorama.component';
import { SelectionAreaComponent } from './selection-area/selection-area.component';
import { FormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { KeyboardShortcutsModule } from 'ng-keyboard-shortcuts';
import { EnvironmentService } from './environment.service';

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
    KeyboardShortcutsModule,
    HttpClientModule,
  ],
  providers: [
    EnvironmentService,
    {
      provide: APP_INITIALIZER,
      useFactory: (envService: EnvironmentService) => {
        return () => envService.loadAppConfig();
      },
      multi: true,
      deps: [EnvironmentService]
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
