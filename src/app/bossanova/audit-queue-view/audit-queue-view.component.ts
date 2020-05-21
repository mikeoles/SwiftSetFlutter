import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import Aisle from 'src/app/models/aisle.model';

@Component({
  selector: 'app-audit-queue-view',
  templateUrl: './audit-queue-view.component.html',
  styleUrls: ['./audit-queue-view.component.scss']
})
export class AuditQueueViewComponent implements OnInit {

  aisles: Aisle[];

  constructor(private apiSerivce: ApiService) { }

  ngOnInit() {
    this.apiSerivce.getAuditQueue().subscribe(aisle => {
      this.aisles = aisle;
    });
  }

  removeAisle(aisle: Aisle) {
    this.apiSerivce.removeQueuedAisle(aisle);
    const index: number = this.aisles.findIndex(a => a.aisleId === aisle.aisleId);
    if (index !== -1) {
        this.aisles.splice(index, 1);
    }
  }
}
