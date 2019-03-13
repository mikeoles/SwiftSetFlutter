import { Component, OnInit, Inject } from '@angular/core';
import { IApiService } from '../api.service';
import { environment } from 'src/environments/environment';
import Store from '../store.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-fleet-view',
  templateUrl: './fleet-view.component.html',
  styleUrls: ['./fleet-view.component.scss'],
  providers: [
    {
      provide: 'IApiService',
      useClass: environment.apiService
    }
  ],
})
export class FleetViewComponent implements OnInit {

  stores: Store[];

  constructor(@Inject('IApiService') private apiService: IApiService, private router: Router) { }

  ngOnInit() {
    this.apiService.getStores().subscribe(stores => {
      this.stores = stores;
      this.router.navigate(['store/' + this.stores[0].storeId]);
    });
  }

}
