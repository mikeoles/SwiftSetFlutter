import { BrowserModule } from '@angular/platform-browser';
import { NgModule, APP_INITIALIZER } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { AppComponent } from './app.component';
import { ProductDetailsComponent } from './aisle-view/product-details/product-details.component';
import { GridComponent } from './aisle-view/product-details/grid/grid.component';
import { PanoramaComponent } from './aisle-view/panorama/panorama.component';
import { SelectionAreaComponent } from './aisle-view/selection-area/selection-area.component';
import { FormsModule } from '@angular/forms';
import { ChartsModule } from 'ng2-charts';
import { StoreViewComponent } from './store-view/store-view.component';
import { StatRingComponent } from './mission-view/stat-ring/stat-ring.component';
import { MissionsGridComponent } from './store-view/missions-grid/missions-grid.component';
import { RoundProgressModule } from 'angular-svg-round-progressbar';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { AisleViewComponent } from './aisle-view/aisle-view.component';
import { AppRoutingModule } from './app-routing.module';
import { DailyGraphsComponent } from './store-view/daily-graphs/daily-graphs.component';
import { MissionViewComponent } from './mission-view/mission-view.component';
import { AislesGridComponent } from './mission-view/aisles-grid/aisles-grid.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { KeyboardShortcutsModule } from 'ng-keyboard-shortcuts';
import { EnvironmentService } from './environment.service';

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
    ChartsModule,
    FormsModule,
    FontAwesomeModule,
    KeyboardShortcutsModule,
    HttpClientModule,
    FormsModule,
    RoundProgressModule,
    AppRoutingModule
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
