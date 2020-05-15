import { Component, OnInit } from '@angular/core';
import Store from '../../models/store.model';
import { ApiService } from '../../services/api.service';
import { Router } from '@angular/router';
import { faCopyright } from '@fortawesome/free-solid-svg-icons';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-bossanova-fleet-view',
  templateUrl: './bossanova-fleet-view.component.html',
  styleUrls: ['./bossanova-fleet-view.component.scss']
})
export class BossanovaFleetViewComponent implements OnInit {

  stores: Store[];
  searchTerm: string;
  keysToExclude: any [] =  ['storeId', 'zoneId', 'canary'];
  faCopyright = faCopyright;

  constructor(private apiService: ApiService, private router: Router, private titleService: Title) { }

  ngOnInit() {
    this.titleService.setTitle('Bossa Nova - Store Viewer');
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
}
