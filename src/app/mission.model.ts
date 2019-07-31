export default class Mission {
  missionId: number;
  missionName: string;
  storeId: string;
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
}
