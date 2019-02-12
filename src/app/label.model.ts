import CustomField from './customField.model';

export default class Label {
  labelId: number;
  labelName: string;
  barcode: string;
  productId: string;
  price: number;
  customFields: Array<CustomField>;
  bounds: {
    top: number;
    left: number;
    width: number;
    height: number;
  };
  boundsMeters: {
    top: number;
    left: number;
    width: number;
    height: number;
  };
  section: string;
}
