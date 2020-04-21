import Label from './label.model';

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
  labels: Label[];
  outs: Label[];
  sectionLabels: Label[];
  topStock: Label[];
  sectionBreaks: number[];
}