import { labelScrollOptions } from 'src/app/labelScrollOptions';

export const environment = {
  production: true,
  showPlugs: false,
  showSuppliers: false,
  coveragePercent: true,
  onHand: true,
  pdfExport: true,
  exportingPDF: true,
  exclusionZones: true,
  exportFields: ['Barcode', 'Product Id', 'Description', 'Department', 'On Hand', 'Layout', 'S. Loc', 'Size', 'SRQ', 'PR', 'Status',
  'Last Recvd', 'DNO'],
  labelScrolling: labelScrollOptions.vertical,
  productGridFields: ['Label Name', 'Barcode', 'Product Id', 'Price', 'On Hand'],
  apiType: 'odata' // Options: odata or static
};
