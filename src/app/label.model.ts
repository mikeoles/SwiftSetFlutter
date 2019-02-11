export default class Label {
  labelId: number;
  labelName: string;
  barcode: string;
  productId: string;
  price: number;
  customFields: object;
  bounds: {
    top: number;
    left: number;
    width: number;
    height: number;
  };
  section: string;
}
