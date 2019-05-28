export default class MissionSummary {
  missionId: number;
  mission: string;
  storeId: number;
  missionDateTime: Date;
  outs: number;
  labels: number;
  spreads: number;
  aislesScanned: number;
  percentageRead: number;
  percentageUnread: number;
  unreadLabels: number;
  readLabelsMissingProduct: number;
  readLabelsMatchingProduct: number;
}
