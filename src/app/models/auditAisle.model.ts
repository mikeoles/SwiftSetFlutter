import { AuditQueueStatus } from '../bossanova/audit-queue-status';

export default class AuditAisle {
  aisleId: string;
  aisleName: string;
  scanDateTime: Date;
  missionId: string;
  missionName: string;
  storeId: string;
  storeName: string;
  labelsCount: number;
  outsCount: number;
  falsePositiveCount: number;
  falseNegativeCount: number;
  owner: string;
  auditQueueStatus: AuditQueueStatus;
}
