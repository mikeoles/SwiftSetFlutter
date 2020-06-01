import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import AuditAisle from 'src/app/models/auditAisle.model';

@Component({
  selector: 'app-audit-queue-view',
  templateUrl: './audit-queue-view.component.html',
  styleUrls: ['./audit-queue-view.component.scss']
})
export class AuditQueueViewComponent implements OnInit {

  auditAisles: AuditAisle[];

  constructor(private apiSerivce: ApiService) { }

  ngOnInit() {
    this.apiSerivce.getAuditQueue().subscribe(auditAisles => {
      this.auditAisles = auditAisles;
    });
  }

  removeAisle(aisle: AuditAisle) {
    this.apiSerivce.removeQueuedAisle(aisle);
    const index: number = this.auditAisles.findIndex(a => a.aisleId === aisle.aisleId);
    if (index !== -1) {
        this.auditAisles.splice(index, 1);
    }
  }
}
