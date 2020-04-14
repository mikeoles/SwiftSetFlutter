import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';
import Store from '../models/store.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-fleet-view',
  templateUrl: './fleet-view.component.html',
  styleUrls: ['./fleet-view.component.scss']
})
export class FleetViewComponent implements OnInit {

  stores: Store[];
  searchTerm: string;

  constructor(private apiService: ApiService, private router: Router) { }

  ngOnInit() {
    this.apiService.getStores().subscribe(stores => {
      this.stores = stores;
      if (this.stores.length === 1) {
        this.router.navigate(['store/' + this.stores[0].storeId]);
      }
    });
  }

  viewStore(storeId: number) {
    this.router.navigate(['store/' + storeId]);
  }


}
