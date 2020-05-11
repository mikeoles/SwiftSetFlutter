import Label from './label.model';
import { AuditQueueStatus } from '../bossanova/audit-queue-status';

export default class Aisle {
  aisleId: string;
  aisleName: string;
  panoramaUrl: string;
  createDateTime: Date;
  scanDateTime: Date;
  labelsCount: number;
  outsCount: number;
  auditQueueStatus: AuditQueueStatus;
  labels: Label[];
  outs: Label[];
  sectionLabels: Label[];
  topStock: Label[];
  sectionBreaks: number[];
}
