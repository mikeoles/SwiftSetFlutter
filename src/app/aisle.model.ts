import Label from './label.model';
import ExclusionZone from './exclusionZone.model';

export default class Aisle {
  aisleId: number;
  aisleName: string;
  panoramaUrl: string;
  coveragePercent: number;
  aisleCoverage: string;
  zone: string;
  labels: Label[];
  labelsCount: number;
  outs: Label[];
  outsCount: number;
  exclusionZones: ExclusionZone[];
  exclusionsCount: number;
}
