import Label from './label.model';
import { AuditQueueStatus } from '../bossanova/audit-queue-status';

export default class Aisle {
  aisleId: string;
  aisleName: string;
  panoramaUrl: string;
  createDateTime: Date;
  scanDateTime: Date;
  labelCount: number;
  outCount: number;
  misreadBarcodeCount: number;
  sectionLabelCount: number;
  sectionBreakCount: number;
  topStockCount: number;
  auditQueueStatus: AuditQueueStatus;
  previouslySeenBarcodeCount: number; // The total number of distinct barcodes in previous N scans
  previouslySeenBarcodeSampleSize: number; // Number of scans the count was taken from
  missingPreviouslySeenBarcodeCount:  number; // The count of missed barcodes
  missingPreviouslySeenBarcodePercentage: number; // the percentage of missed barcodes (1% = 0.01).
  labels: Label[];
  outs: Label[];
  sectionLabels: Label[];
  topStock: Label[];
  sectionBreaks: number[];
  missingPreviouslySeenBarcodes: Label[];
  storeName: string;
  storeId: string;
  missionName: string;
  missionId: string;
  falsePositiveCount: number;
  falseNegativeCount: number;
  owner: string;
}
