import { Component, OnInit } from '@angular/core';
import Store from '../../models/store.model';
import { ApiService } from '../../services/api.service';
import { Router } from '@angular/router';
import { faCopyright } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-bossanova-fleet-view',
  templateUrl: './bossanova-fleet-view.component.html',
  styleUrls: ['./bossanova-fleet-view.component.scss']
})
export class BossanovaFleetViewComponent implements OnInit {

  stores: Store[];
  searchTerm: string;
  displayingFlaggedStores = false;
  faCopyright = faCopyright;

  constructor(private apiService: ApiService, private router: Router) { }

  ngOnInit() {
    this.apiService.getStores().subscribe(stores => {
      this.stores = stores;
      this.stores.sort(function(x, y) {
        return (x.canary === y.canary) ? 0 : x.canary ? -1 : 1;
      });
    });
  }

  viewStore(storeId: number) {
    this.router.navigate(['store/' + storeId]);
  }

  // Display only stores that have missions which contain aisles flagged for low coverage deltas
  clickFlaggedStores() {
    this.displayingFlaggedStores = !this.displayingFlaggedStores;
    if (this.displayingFlaggedStores) {
      this.apiService.getFlaggedStores().subscribe(stores => {
        this.stores = stores;
      });
    } else {
      this.apiService.getStores().subscribe(stores => {
        this.stores = stores;
      });
    }
  }
}
