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

  @Output() completeStage = new EventEmitter();

  buttonText = 'Start Audit';

  constructor() { }

  ngOnInit() {
  }

  nextStage() {
    this.completeStage.emit();
    if (this.auditStage === AuditStage.overview) {
      this.buttonText = 'Complete False Positives';
    } else if (this.auditStage === AuditStage.falsePositives) {
      this.buttonText = 'Complete False Negatives';
    }
  }

}
