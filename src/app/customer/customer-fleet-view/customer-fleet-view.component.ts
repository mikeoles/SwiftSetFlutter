import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import Store from '../../models/store.model';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-customer-fleet-view',
  templateUrl: './customer-fleet-view.component.html',
  styleUrls: ['./customer-fleet-view.component.scss']
})
export class CustomerFleetViewComponent implements OnInit {

  stores: Store[];
  searchTerm: string;
  keysToExclude: any [] =  ['storeId', 'zoneId', 'canary'];

  constructor(private apiService: ApiService, private router: Router, private titleService: Title) { }

  ngOnInit() {
    this.titleService.setTitle('Bossa Nova - Store Viewer');
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
