import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { AuditStage } from '../audit-stage';
import Aisle from 'src/app/models/aisle.model';

@Component({
  selector: 'app-audit-summary',
  templateUrl: './audit-summary.component.html',
  styleUrls: ['./audit-summary.component.scss']
})
export class AuditSummaryComponent implements OnInit {

  @Input() auditStage: AuditStage;
  @Input() aisle: Aisle;
  @Input() misreadCount: number;
  @Input() undetectedLabelsCount: number;
  @Output() completeStage = new EventEmitter();

  buttonText = 'Start Audit';

  constructor() { }

  ngOnInit() {
  }

  nextStage() {
    this.completeStage.emit();
    if (this.auditStage === AuditStage.overview || this.auditStage === AuditStage.falsePositives
      || this.auditStage === AuditStage.falseNegatives) {
      this.buttonText = 'Complete Stage';
    } else if (this.auditStage === AuditStage.misread) {
      this.buttonText = 'Finish';
    }
  }

}
