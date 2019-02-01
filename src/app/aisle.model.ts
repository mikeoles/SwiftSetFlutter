import Label from './label.model';

export default class Aisle {
  id: number;
  name: string;
  panoramaUrl: string;
  labels: Label[];
  outs: Label[];
  spreads: Label[];
}
