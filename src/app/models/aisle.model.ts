import Label from './label.model';

export default class Aisle {
  aisleId: string;
  aisleName: string;
  coverageDelta: number;
  historicalAverageDetected: number;
  historicalAverageSampleSize: number;
  panoramaUrl: string;
  createDateTime: Date;
  scanDateTime: Date;
  labelsCount: number;
  outsCount: number;
  labels: Label[];
  outs: Label[];
  sectionLabels: Label[];
  topStock: Label[];
  sectionBreaks: number[];
}
