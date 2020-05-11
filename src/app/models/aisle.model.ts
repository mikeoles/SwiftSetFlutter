import Label from './label.model';
import { AuditQueueStatus } from '../bossanova/audit-queue-status';

export default class Aisle {
  aisleId: string;
  aisleName: string;
  coveragePercent: number;
  panoramaUrl: string;
  createDateTime: Date;
  scanDateTime: Date;
  labelsCount: number;
  outsCount: number;
  aisleCoverage: string;
  auditQueueStatus: AuditQueueStatus;
  labels: Label[];
  outs: Label[];
  sectionLabels: Label[];
  topStock: Label[];
  sectionBreaks: number[];
}
