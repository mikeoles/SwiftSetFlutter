import DaySummary from './daySummary.model';

export default class Store {
  storeId: string;
  storeNumber: number;
  storeName: string;
  storeAddress: string;
  totalAverageOuts: number;
  totalAverageLabels: number;
  summaryOuts: Array<DaySummary>;
  summaryLabels: Array<DaySummary>;
}
