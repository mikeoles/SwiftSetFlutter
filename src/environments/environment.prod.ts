import { labelScrollOptions } from 'src/app/labelScrollOptions';
import { ODataApiService } from 'src/app/oDataApi.service';

export const environment = {
  production: true,
  showPlugs: false,
  showSuppliers: false,
  coveragePercent: true,
  exportFields: ['Barcode', 'Price', 'Aisle Name', 'Zone', 'Section',
  'Mission Id', 'Mission Date Time', 'Store Id', 'Product Id', 'Top', 'Left', 'Top Meters', 'Left Meters'],
  labelScrolling: labelScrollOptions.vertical,
  productGridFields: ['Label Name', 'Barcode', 'Product Id', 'Price'],
  apiService: ODataApiService
};
