import CustomField from './customField.model';

export default class Label {
  labelId: string;
  labelName: string;
  barcode: string;
  productId: string;
  price: number;
  department: string;
  onHand: number;
  section: string;
  bounds: {
    top: number;
    left: number;
    width: number;
    height: number;
  };
  customFields: Array<CustomField>;
  color: string;
}
