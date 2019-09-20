import Label from './label.model';
import SectionLabel from './sectionLabel.model';

export default class Aisle {
  aisleId: string;
  aisleName: string;
  coveragePercent: number;
  panoramaUrl: string;
  createDateTime: Date;
  labelsCount: number;
  outsCount: number;
  aisleCoverage: string;
  labels: Label[];
  outs: Label[];
  sectionLabels: SectionLabel[];
  topStock: Label[];
  sectionBreaks: number[];
}
