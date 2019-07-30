import Label from './label.model';

export default class Aisle {
  aisleId: number;
  aisleName: string;
  coveragePercent: number;
  panoramaUrl: string;
  createDateTime: Date;
  labelsCount: number;
  outsCount: number;
  aisleCoverage: string;
  labels: Label[];
  outs: Label[];
}
