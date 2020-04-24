import { BrowserModule } from '@angular/platform-browser';
import { NgModule, APP_INITIALIZER } from '@angular/core';
import { HttpClientModule, HttpClient, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AppComponent } from './app.component';
import { ProductDetailsComponent } from './aisle-view/product-details/product-details.component';
import { ProductGridComponent } from './aisle-view/product-details/product-grid/product-grid.component';
import { PanoramaComponent } from './aisle-view/panorama/panorama.component';
import { SelectionAreaComponent } from './aisle-view/selection-area/selection-area.component';
import { FormsModule } from '@angular/forms';
import { ChartsModule } from 'ng2-charts';
import { StoreViewComponent } from './store-view/store-view.component';
import { MissionStatsComponent } from './mission-view/mission-stats/mission-stats.component';
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
import { EnvironmentService } from './services/environment.service';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { ModalComponent } from './modal/modal.component';
import { ModalService } from './modal/modal.service';
import { NgDatepickerModule } from 'ng2-datepicker';
import { DataService } from './services/data.service';
import { ProgressBarModule } from 'angular-progress-bar';
import { AuthComponent } from './auth/auth.component';
import { AuthInterceptor } from './auth/auth.interceptor';
import { AuthService } from './auth/auth.service';
import { ApiService } from './services/api.service';
import { UrlService } from './services/url.service';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { DebugViewComponent } from './debug-view/debug-view.component';
import { DebugPanoramaComponent } from './debug-view/debug-panorama/debug-panorama.component';
import { DebugFiltersComponent } from './debug-view/debug-filters/debug-filters.component';
import { UnauthorizedComponent } from './unauthorized/unauthorized.component';
import { CustomerModule } from './customer/customer.module';
import { BossanovaModule } from './bossanova/bossanova.module';
import { FleetViewComponent } from './fleet-view/fleet-view.component';

@NgModule({
  declarations: [
    AppComponent,
    ProductDetailsComponent,
    ProductGridComponent,
    PanoramaComponent,
    SelectionAreaComponent,
    StoreViewComponent,
    MissionStatsComponent,
    MissionsGridComponent,
    PageNotFoundComponent,
    AisleViewComponent,
    DailyGraphsComponent,
    MissionViewComponent,
    AislesGridComponent,
    ModalComponent,
    FleetViewComponent,
    AuthComponent,
    DebugViewComponent,
    DebugPanoramaComponent,
    DebugFiltersComponent,
    UnauthorizedComponent,
  ],
  imports: [
    BrowserModule,
    ChartsModule,
    FormsModule,
    FontAwesomeModule,
    KeyboardShortcutsModule.forRoot(),
    HttpClientModule,
    FormsModule,
    RoundProgressModule,
    AppRoutingModule,
    NgMultiSelectDropDownModule.forRoot(),
    NgDatepickerModule,
    ProgressBarModule,
    Ng2SearchPipeModule,
    CustomerModule,
    BossanovaModule
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
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
      deps: [AuthService],
    },
    AuthService,
    ModalService,
    DataService,
    ApiService,
    UrlService,
    HttpClient,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
