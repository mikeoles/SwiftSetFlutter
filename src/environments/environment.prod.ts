import { labelScrollOptions } from 'src/app/labelScrollOptions';

export const environment = {
  production: true,
  showPlugs: false,
  showSuppliers: false,
  coveragePercent: true,
  onHand: true,
  exportFields: ['Barcode', 'Price', 'Aisle Name', 'Zone', 'Section',
  'Mission Id', 'Mission Date Time', 'Store Id', 'Product Id', 'Top', 'Left', 'Top Meters', 'Left Meters'],
  labelScrolling: labelScrollOptions.vertical,
  productGridFields: ['Label Name', 'Barcode', 'Product Id', 'Price', 'On Hand'],
  apiType: 'odata' // Options: odata or static
};
