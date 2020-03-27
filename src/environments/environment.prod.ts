import { labelScrollOptions } from 'src/app/labelScrollOptions';

export const environment = {
  production: true,
  authUrl: 'http://localhost:5556/auth?',
  authClientId: 'example-app',
  coveragePercent: true,
  exportFields: ['Barcode', 'top', 'left', 'width', 'height'],
  labelScrolling: labelScrollOptions.vertical,
  missionHistoryDays: 14, // Number of days to display missions for
  permissions: ['topStock', 'debugging', 'sectionLabels', 'sectionBreaks'],
  productGridFields: ['Label Name', 'Barcode', 'Product Id', 'Price'],
  onHand: true,
  showExportButtons: false, // Hides: Request Data, Aisle Scan Data, Mission Export, Aisle Export (besides pano)
  showMisreadBarcodes: false, // Hides misread barcodes button on pano view
};
