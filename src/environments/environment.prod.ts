import { labelScrollOptions } from 'src/app/labelScrollOptions';

export const environment = {
  production: true,
  showPlugs: false,
  showSuppliers: false,
  departments: false,
  sections: true,
  exportFields: ['Barcode', 'Price', 'Aisle Name', 'Zone', 'Section',
  'Mission Id', 'Mission Date Time', 'Store Id', 'Product Id', 'Top', 'Left', 'Top Meters', 'Left Meters'],
  labelScrolling: labelScrollOptions.vertical
};
