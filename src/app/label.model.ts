import CustomField from './customField.model';
import ProductCoordinate from './productCoordinate.model';

export default class Label {
  labelId: number;
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
  productCoordinates: ProductCoordinate[];
  customFields: Array<CustomField>;
}
