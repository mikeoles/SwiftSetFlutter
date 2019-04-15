import CustomField from './customField.model';

export default class Label {
  labelId: number;
  labelName: string;
  barcode: string;
  productId: string;
  price: number;
  department: string;
  onHand: number;
  customFields: Array<CustomField>;
  bounds: {
    top: number;
    left: number;
    width: number;
    height: number;
    topMeters: number;
    leftMeters: number;
    widthMeters: number;
    heightMeters: number;
  };
  section: string;
}
