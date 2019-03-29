import DaySummary from './daySummary.model';

export default class Store {
  storeId: number;
  storeName: string;
  storeAddress: string;
  totalAverageOuts: number;
  totalAverageLabels: number;
  totalAverageSpreads: number;
  summaryOuts: Array<DaySummary>;
  summaryLabels: Array<DaySummary>;
  summarySpreads: Array<DaySummary>;
}
