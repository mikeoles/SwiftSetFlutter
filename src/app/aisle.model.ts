import Label from './label.model';

export default class Aisle {
  aisleId: number;
  aisleName: string;
  panoramaUrl: string;
  zone: string;
  labels: Label[];
  outs: Label[];
  spreads: Label[];
}
