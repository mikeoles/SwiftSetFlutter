export default class Label {
  id: number;
  name: string;
  barcode: string;
  productId: string;
  price: number;
  bounds: {
    top: number;
    left: number;
    width: number;
    height: number;
  };
}
