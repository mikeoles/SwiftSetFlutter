import Aisle from './aisle.model';

export default class Mission {
  missionId: string;
  missionName: string;
  storeId: string;
  storeName: string;
  storeNumber: number;
  startDateTime: Date;
  endDateTime: Date;
  createDateTime: Date;
  aisleCount: number;
  labels: number;
  outs: number;
  readLabelsMissingProduct: number;
  readLabelsMatchingProduct: number;
  unreadLabels: number;
  percentageUnread: number;
  percentageRead: number;
  aisles: Aisle[];
  hasCoverageIssue: boolean;
}
